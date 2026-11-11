import test from 'node:test';
import assert from 'node:assert/strict';
import { rankRecipes, type RecommendationCandidate } from '../app/lib/recommendations';

function recipe(id: number, ingredientIds: number[], extra: Partial<RecommendationCandidate> = {}): RecommendationCandidate {
  return { id: String(id), title: `Recept ${id}`, type: 'Leves', time: 20, kcal: 550, protein: 35,
    carbs: 55, fat: 20, match: 0, image: null, tags: [], servings: 2, ingredients: [], description: '',
    ingredientIds, allergenIds: [], ...extra };
}
const targets = [550, 35, 55, 20];

test('higher pantry coverage ranks first; match is a real percentage', () => {
  const result = rankRecipes([recipe(1, [1, 2, 3]), recipe(2, [1, 2])], [1, 2], 'Leves', [], targets);
  assert.deepEqual(result.recommendedIds, ['2', '1']);
  assert.deepEqual(result.recipes.map(r => r.match), [100, 67]);
});
test('allergens exclude recipes from both recommendations and alternatives', () => {
  const result = rankRecipes([recipe(1, [1], { allergenIds: [7] }), recipe(2, [9], { type: 'Főétel', allergenIds: [7] }), recipe(3, [2])], [1], 'Leves', [7], targets);
  assert.deepEqual(result.recipes.map(r => r.id), ['3']);
  assert.deepEqual(result.recommendedIds, []);
});
test('empty pantry returns no personal matches but retains alternatives', () => {
  const result = rankRecipes([recipe(1, [1]), recipe(2, [])], [], null, [], targets);
  assert.equal(result.recommendedIds.length, 0);
  assert.equal(result.recipes.length, 2);
  assert.ok(result.recipes.every(r => r.match === 0));
});
test('preferred category is required only for the personal group', () => {
  const result = rankRecipes([recipe(1, [1], { type: 'Desszert' }), recipe(2, [1])], [1], 'Leves', [], targets);
  assert.deepEqual(result.recommendedIds, ['2']);
  assert.equal(result.recipes.length, 2);
});
test('at most five personal matches, all remaining recipes are retained once', () => {
  const candidates = Array.from({ length: 9 }, (_, i) => recipe(i + 1, [1]));
  const result = rankRecipes([...candidates, candidates[0]], [1], null, [], targets);
  assert.equal(result.recommendedIds.length, 5);
  assert.equal(result.recipes.length, 9);
  assert.equal(new Set(result.recipes.map(r => r.id)).size, 9);
});
test('macro targets break equal pantry matches deterministically', () => {
  const candidates = [recipe(1, [1], { kcal: 1000 }), recipe(2, [1])];
  const result = rankRecipes(candidates, [1], null, [], targets);
  assert.deepEqual(result.recommendedIds, ['2', '1']);
  assert.deepEqual(result, rankRecipes(candidates, [1], null, [], targets));
});
test('unknown nutrition and zero targets remain finite and usable', () => {
  const result = rankRecipes([recipe(1, [1], { kcal: null, protein: null, fat: null, carbs: null })], [1], null, [], [0, 0, 0, 0]);
  assert.deepEqual(result.recommendedIds, ['1']);
});
test('empty catalog and complete allergy exclusion return empty groups', () => {
  assert.deepEqual(rankRecipes([], [], null, [], targets), { recipes: [], recommendedIds: [] });
  assert.deepEqual(rankRecipes([recipe(1, [1], { allergenIds: [2] })], [1], null, [2], targets), { recipes: [], recommendedIds: [] });
});
