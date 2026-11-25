import test from 'node:test';
import assert from 'node:assert/strict';
import { recipeImageUrl, demoRecipeImages } from '../app/lib/recipe-images';
import { readApiResponse } from '../app/lib/api-response';

test('existing recipes resolve to remote images without local files', () => {
  assert.match(recipeImageUrl('/img/receptek/gulyasleves.jpg')!, /^https:\/\//);
  assert.equal(recipeImageUrl('/assets/shakshuka.png'), demoRecipeImages.shakshuka);
  assert.ok(Object.values(demoRecipeImages).every(url => url.startsWith('https://')));
  assert.equal(recipeImageUrl('/img/receptek/unknown.jpg'), null);
});

test('cloud URLs work directly; legacy paths can use a cloud folder', () => {
  const url = 'https://images.example.com/new-recipe.webp?version=2';
  assert.equal(recipeImageUrl(url, 'https://cdn.example.com/photos'), url);
  assert.equal(recipeImageUrl('/img/receptek/new.webp', 'https://cdn.example.com/photos'),
    'https://cdn.example.com/photos/img/receptek/new.webp');
  for (const value of ['//example.com/image.jpg', 'javascript:alert(1)', null]) {
    assert.equal(recipeImageUrl(value), null);
  }
  assert.equal(recipeImageUrl('/../private.jpg', 'https://cdn.example.com/photos'), null);
});

test('HTML API errors produce a useful message instead of JSON syntax errors', async () => {
  await assert.rejects(readApiResponse(new Response('<!DOCTYPE html><h1>Not Found</h1>', {
    status: 404, headers: { 'Content-Type': 'text/html' },
  })), /API nem JSON-választ/);
  await assert.rejects(readApiResponse(new Response('{broken', {
    headers: { 'Content-Type': 'application/json' },
  })), /hibás választ/);
  await assert.rejects(readApiResponse(Response.json({ error: 'Adatbázis nem elérhető.' }, { status: 503 })),
    /Adatbázis nem elérhető/);
  assert.deepEqual(await readApiResponse(Response.json({ ok: true })), { ok: true });
});
