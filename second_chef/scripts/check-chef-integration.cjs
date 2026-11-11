const assert = require('node:assert/strict');
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ path: '.env', quiet: true });
const base = process.env.CHEF_TEST_URL || 'http://127.0.0.1:3107';

async function request(path = '', method = 'GET', body, expected = 200, origin = base) {
  const response = await fetch(`${base}/api/chef${path}`, { method,
    headers: { 'Content-Type': 'application/json', Origin: origin },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const data = await response.json();
  assert.equal(response.status, expected, JSON.stringify(data));
  return data;
}

async function main() {
  const id = Number(process.env.TEST_USER_ID);
  assert.ok(Number.isSafeInteger(id) && id > 0);
  const db = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
  await db.connect();
  let original, allergyRows, pantryRow, ingredientId, changed = false;
  try {
    original = (await db.query('SELECT preferencia, makrocelok FROM fiok WHERE id=$1', [id])).rows[0];
    allergyRows = (await db.query('SELECT allergen_id FROM allergen_fiok_osszekoto WHERE fiok_id=$1 ORDER BY allergen_id', [id])).rows;
    const before = await request();
    assert.equal(before.userId, id);
    assert.ok(before.ingredients.length > 0);
    assert.ok(!JSON.stringify(before).includes('password'));
    assert.equal(new Set(before.recipes.map(r => r.id)).size, before.recipes.length);
    assert.ok(before.recommendedIds.length <= 5);
    for (const recipeId of before.recommendedIds) {
      const recipe = before.recipes.find(r => r.id === recipeId);
      assert.ok(recipe && recipe.match > 0);
      if (before.profile.preference) assert.equal(recipe.type, before.profile.preference);
    }
    await request('/profile', 'PATCH', { ...before.profile, userId: 999 }, 400);
    await request('/profile', 'PATCH', { ...before.profile, macros: [-1, 0, 0, 0] }, 400);
    await request('/profile', 'PATCH', before.profile, 400, 'https://different-origin.example');
    await request('/pantry', 'POST', { ingredientId: 2147483647, qty: 1, unit: 'g', category: 'Hűtő' }, 400);
    await request('/pantry', 'DELETE', { ingredientId: 1, userId: 999 }, 400);
    console.log('PASS read endpoint, grouping, validation and cross-origin rejection');

    ingredientId = before.ingredients.find(i => !before.pantry.some(p => p.id === i.id))?.id ?? before.ingredients[0].id;
    pantryRow = (await db.query('SELECT * FROM huto WHERE profil_id=$1 AND alapanyag_id=$2', [id, ingredientId])).rows[0];
    changed = true;
    const item = { ingredientId, qty: 125, unit: 'g', category: 'Szárazáru' };
    await request('/pantry', 'POST', item);
    await request('/pantry', 'POST', { ...item, qty: 250 });
    const savedPantry = await request();
    assert.equal(savedPantry.pantry.filter(p => p.id === ingredientId).length, 1);
    assert.equal(savedPantry.pantry.find(p => p.id === ingredientId).qty, 250);
    assert.equal((await db.query('SELECT mennyiseg FROM huto WHERE profil_id=$1 AND alapanyag_id=$2', [id, ingredientId])).rows[0].mennyiseg, 250);
    await request('/pantry', 'DELETE', { ingredientId });
    assert.ok(!(await request()).pantry.some(p => p.id === ingredientId));
    console.log('PASS pantry add/update/delete persist to PostgreSQL');

    const allAllergyIds = before.allergens.map(a => a.id);
    const profile = { preference: '', allergyIds: allAllergyIds, macros: [600, 40, 50, 15] };
    await request('/profile', 'PATCH', profile);
    const saved = await request();
    assert.deepEqual(saved.profile, profile);
    const forbidden = new Set((await db.query(`SELECT DISTINCT r.recept_id FROM recept_alapanyag_osszekoto r
      JOIN allergen_alapanyag_osszekoto a ON a.alapanyag_id=r.alapanyag_id
      WHERE a.allergen_id=ANY($1::int[])`, [allAllergyIds])).rows.map(r => String(r.recept_id)));
    assert.ok(saved.recipes.every(r => !forbidden.has(r.id)));
    assert.ok(saved.recommendedIds.every(recipeId => !forbidden.has(recipeId)));
    assert.deepEqual((await db.query('SELECT makrocelok FROM fiok WHERE id=$1', [id])).rows[0].makrocelok, profile.macros);
    console.log('PASS profile persistence and allergy exclusion in both groups');
  } finally {
    if (changed) {
      await db.query('BEGIN');
      try {
        await db.query('UPDATE fiok SET preferencia=$2, makrocelok=$3::json WHERE id=$1', [id, original.preferencia, original.makrocelok === null ? null : JSON.stringify(original.makrocelok)]);
        await db.query('DELETE FROM allergen_fiok_osszekoto WHERE fiok_id=$1', [id]);
        for (const row of allergyRows) await db.query('INSERT INTO allergen_fiok_osszekoto(fiok_id,allergen_id) VALUES($1,$2)', [id, row.allergen_id]);
        await db.query('DELETE FROM huto WHERE profil_id=$1 AND alapanyag_id=$2', [id, ingredientId]);
        if (pantryRow) await db.query('INSERT INTO huto(profil_id,alapanyag_id,mennyiseg,egyseg,kategoria) VALUES($1,$2,$3,$4,$5)', [id, ingredientId, pantryRow.mennyiseg, pantryRow.egyseg, pantryRow.kategoria]);
        await db.query('COMMIT');
        console.log('Original test profile and pantry restored.');
      } catch (error) { await db.query('ROLLBACK'); throw error; }
    }
    await db.end();
  }
}
main().catch(error => { console.error('Integration check failed:', error.message); process.exitCode = 1; });
