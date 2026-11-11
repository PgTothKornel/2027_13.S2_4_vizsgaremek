import { prisma } from './prisma';
import { defaultMacros, type ChefData } from './chef-data';
import { rankRecipes, type RecommendationCandidate } from './recommendations';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

export function testUserId() {
  const id = Number(process.env.TEST_USER_ID);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('TEST_USER_ID must identify an existing test account');
  return id;
}

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}
function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}
function recipeImage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.startsWith('https://')) return value;
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  const publicRoot = resolve(process.cwd(), 'public');
  const file = resolve(publicRoot, `.${value}`);
  return file.startsWith(publicRoot + sep) && existsSync(file) ? value : null;
}
function macros(value: unknown): ChefData['profile']['macros'] {
  return Array.isArray(value) && value.length === 4 && value.every(v => number(v) !== null)
    ? value as ChefData['profile']['macros'] : [...defaultMacros];
}

export async function loadChefData(id: number): Promise<ChefData> {
  return prisma.$transaction(async tx => {
    const user = await tx.fiok.findUnique({
      where: { id },
      select: { id: true, preferencia: true, makrocelok: true,
        huto: { include: { alapanyag: true }, orderBy: { alapanyag_id: 'asc' } },
        allergen_fiok_osszekoto: { select: { allergen_id: true } } },
    });
    if (!user) throw new Error('Configured test account does not exist');
    const [rows, categories, allergens, ingredients] = await Promise.all([
      tx.recept.findMany({ include: { Kategoria: true,
        recept_alapanyag_osszekoto: { include: { alapanyag: {
          include: { allergen_alapanyag_osszekoto: true } } } } } }),
      tx.kategoria.findMany({ orderBy: { id: 'asc' } }),
      tx.allergenek.findMany({ orderBy: { id: 'asc' } }),
      tx.alapanyag.findMany({ select: { id: true, nev: true }, orderBy: { nev: 'asc' } }),
    ]);
    const pantryIds = user.huto.filter(item => item.mennyiseg === null || item.mennyiseg > 0)
      .map(item => item.alapanyag_id);
    const pantrySet = new Set(pantryIds);
    const allergyIds = user.allergen_fiok_osszekoto.map(item => item.allergen_id);
    const targets = macros(user.makrocelok);
    const candidates: RecommendationCandidate[] = rows.map(row => {
      const nutrients = object(row.tapanyagok);
      const links = row.recept_alapanyag_osszekoto;
      const protein = number(nutrients.feherje_g);
      const image = object(row.kep).fo_kep;
      const steps = Array.isArray(row.lepesek) ? [...row.lepesek]
        .sort((a, b) => Number(object(a).sorszam ?? 0) - Number(object(b).sorszam ?? 0))
        .map(step => object(step).leiras).filter((step): step is string => typeof step === 'string') : [];
      return {
        id: String(row.id), title: row.nev, type: row.Kategoria.kategoria,
        time: row.ido, servings: Math.max(1, row.adag), description: row.leiras,
        kcal: number(nutrients.kcal), protein, carbs: number(nutrients.szenhidrat_g), fat: number(nutrients.zsir_g),
        image: recipeImage(image),
        tags: [...(row.ido <= 30 ? ['quick'] : []), ...(protein !== null && protein >= 30 ? ['high-protein'] : [])],
        match: 0, steps,
        ingredientIds: links.map(link => link.alapanyag_id),
        allergenIds: links.flatMap(link => link.alapanyag.allergen_alapanyag_osszekoto.map(item => item.allergen_id)),
        // The join table contains no recipe quantities: never invent amounts.
        ingredients: links.map(link => [link.alapanyag.nev, null, '', pantrySet.has(link.alapanyag_id)]),
      };
    });
    const ranked = rankRecipes(candidates, pantryIds, user.preferencia, allergyIds, targets);
    return {
      userId: id,
      profile: { preference: user.preferencia ?? '', allergyIds, macros: targets },
      pantry: user.huto.map(item => ({ id: item.alapanyag_id, name: item.alapanyag.nev,
        qty: item.mennyiseg, unit: item.egyseg ?? '', category: item.kategoria ?? 'Egyéb' })),
      categories: categories.map(item => ({ id: item.id, name: item.kategoria })),
      allergens: allergens.map(item => ({ id: item.id, name: item.nev })),
      ingredients: ingredients.map(item => ({ id: item.id, name: item.nev })),
      recipes: ranked.recipes.map(({ ingredientIds: _i, allergenIds: _a, carbs: _c, fat: _f, ...recipe }) => recipe),
      recommendedIds: ranked.recommendedIds,
    };
  }, { timeout: 15000 });
}
