// Read-only deployment checks. Never print connection strings or driver messages.
const path = require('node:path');
const appRoot = path.resolve(__dirname, '..');

async function main() {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(appRoot, '.env.local'), quiet: true });
  dotenv.config({ path: path.join(appRoot, '.env'), quiet: true });

  const problems = [];
  if (!process.env.DATABASE_URL) problems.push('DATABASE_URL is missing.');
  const id = Number(process.env.TEST_USER_ID);
  if (!Number.isSafeInteger(id) || id <= 0)
    problems.push('TEST_USER_ID must be a positive integer identifying an existing fiok.id (seed: 1).');
  if (problems.length) throw new Error(problems.join('\n'));

  let url;
  try { url = new URL(process.env.DATABASE_URL); }
  catch { throw new Error('DATABASE_URL is not a valid URL.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol))
    throw new Error('DATABASE_URL must use postgres:// or postgresql://.');

  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000, statement_timeout: 10000 });
  try {
    await client.connect();
    await client.query('BEGIN READ ONLY');
    const required = { fiok: ['id', 'preferencia', 'makrocelok'],
      huto: ['profil_id', 'alapanyag_id', 'mennyiseg', 'egyseg', 'kategoria'],
      recept: ['id'], Kategoria: ['id'], alapanyag: ['id'], allergenek: ['id'],
      allergen_fiok_osszekoto: ['fiok_id', 'allergen_id'],
      allergen_alapanyag_osszekoto: ['alapanyag_id', 'allergen_id'],
      recept_alapanyag_osszekoto: ['recept_id', 'alapanyag_id'] };
    const { rows } = await client.query(`SELECT table_name, column_name
      FROM information_schema.columns WHERE table_schema = 'public'`);
    const missing = Object.entries(required).flatMap(([table, columns]) => columns
      .filter(column => !rows.some(row => row.table_name === table && row.column_name === column))
      .map(column => `${table}.${column}`));
    if (missing.length) throw new Error(`Missing database columns: ${missing.join(', ')}. See DEPLOYMENT.md; do not reset the database.`);
    const users = await client.query('SELECT id FROM fiok WHERE id = $1', [id]);
    if (!users.rowCount) throw new Error('TEST_USER_ID does not match an existing fiok row.');
    const recipes = await client.query('SELECT count(*)::int AS count FROM recept');
    if (!recipes.rows[0].count) throw new Error('The database has no recipes. Import the project data before deployment.');
    console.log('OK: database reachable, required schema present, test account and recipes exist. No data changed.');
  } catch (error) {
    // Our own messages are safe; database errors can contain credentials or data.
    if (error?.code) throw new Error(`Database check failed (code: ${String(error.code).replace(/[^a-zA-Z0-9_]/g, '')}). Check connection, TLS and permissions.`);
    if (error?.constructor === Error && /^(Missing database columns:|TEST_USER_ID |The database has no recipes)/.test(error.message)) throw error;
    throw new Error('Database connection or query failed. Check the provider connection and Vercel environment settings.');
  } finally {
    await client.query('ROLLBACK').catch(() => {});
    await client.end().catch(() => {});
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
