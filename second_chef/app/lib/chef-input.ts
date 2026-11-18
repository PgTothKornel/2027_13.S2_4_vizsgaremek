import type { Profile } from './chef-data';
import { categories } from './demo-data';

export class InputError extends Error {}

export const invalidDataMessage = 'Ellenőrizd a megadott adatokat.';
const pantryUnits = ['db', 'g', 'kg', 'ml', 'csomag'];

function readFields(body: unknown, fields: string[]) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new InputError(invalidDataMessage);
  }

  const hasExpectedFields = fields.every(field => Object.hasOwn(body, field));
  if (!hasExpectedFields || Object.keys(body).length !== fields.length) {
    throw new InputError(invalidDataMessage);
  }

  return body as Record<string, unknown>;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isNumberInRange(value: unknown, max: number): value is number {
  return typeof value === 'number' && value >= 0 && value <= max;
}

export function readIngredientId(body: unknown) {
  const { ingredientId } = readFields(body, ['ingredientId']);
  if (!isPositiveInteger(ingredientId)) {
    throw new InputError(invalidDataMessage);
  }

  return ingredientId;
}

export function readPantryItem(body: unknown) {
  const { ingredientId, qty, unit, category } = readFields(body, ['ingredientId', 'qty', 'unit', 'category']);

  if (!isPositiveInteger(ingredientId) || (qty !== null && !isNumberInRange(qty, 1000000))) {
    throw new InputError(invalidDataMessage);
  }
  if (typeof unit !== 'string' || !pantryUnits.includes(unit)) {
    throw new InputError(invalidDataMessage);
  }
  if (typeof category !== 'string' || !categories.includes(category)) {
    throw new InputError(invalidDataMessage);
  }

  return { ingredientId, qty, unit, category };
}

export function readProfile(body: unknown): Profile {
  const { preference, allergyIds, macros } = readFields(body, ['preference', 'allergyIds', 'macros']);

  if (typeof preference !== 'string' || preference.length > 255) {
    throw new InputError(invalidDataMessage);
  }
  if (!Array.isArray(allergyIds) || allergyIds.length > 100 || !allergyIds.every(isPositiveInteger)) {
    throw new InputError(invalidDataMessage);
  }
  if (!Array.isArray(macros) || macros.length !== 4) {
    throw new InputError(invalidDataMessage);
  }

  const [kcal, protein, carbs, fat] = macros;
  if (!isNumberInRange(kcal, 20000) || !isNumberInRange(protein, 2000) ||
    !isNumberInRange(carbs, 2000) || !isNumberInRange(fat, 2000)) {
    throw new InputError(invalidDataMessage);
  }

  return { preference, allergyIds, macros: [kcal, protein, carbs, fat] };
}
