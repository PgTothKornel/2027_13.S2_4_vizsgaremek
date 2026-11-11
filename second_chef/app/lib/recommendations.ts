import type { Recipe } from './demo-data';

export type RecommendationCandidate = Recipe & {
  ingredientIds: number[];
  allergenIds: number[];
  carbs: number | null;
  fat: number | null;
};

// Pure ranking: the same input gives the same order, without duplicate recipes.
export function rankRecipes(
  candidates: RecommendationCandidate[],
  pantryIds: number[],
  preference: string | null,
  allergyIds: number[],
  macros: number[],
) {
  const pantry = new Set(pantryIds);
  const allergies = new Set(allergyIds);
  const unique = [...new Map(candidates.map(recipe => [recipe.id, recipe])).values()];
  const ranked = unique
    .filter(recipe => !recipe.allergenIds.some(id => allergies.has(id)))
    .map(recipe => {
      const ids = [...new Set(recipe.ingredientIds)];
      const available = ids.filter(id => pantry.has(id)).length;
      const ratio = ids.length ? available / ids.length : 0;
      const preferred = !preference || recipe.type === preference;
      const values = [recipe.kcal, recipe.protein, recipe.carbs, recipe.fat];
      const macroDistance = values.reduce<number>((total, value, index) => {
        const target = macros[index];
        return total + (value !== null && target > 0 ? Math.abs(value - target) / target : 0);
      }, 0);
      return { recipe: { ...recipe, match: Math.round(ratio * 100) }, ratio, available, preferred, macroDistance };
    })
    .sort((a, b) => b.ratio - a.ratio || b.available - a.available ||
      Number(b.preferred) - Number(a.preferred) || a.macroDistance - b.macroDistance ||
      Number(a.recipe.id) - Number(b.recipe.id));
  const recommendedIds = ranked
    .filter(item => item.available > 0 && item.preferred)
    .slice(0, 5).map(item => item.recipe.id);
  return { recipes: ranked.map(item => item.recipe), recommendedIds };
}
