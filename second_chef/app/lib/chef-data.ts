import type { PantryItem, Recipe } from './demo-data';

export type Profile = {
  preference: string;
  allergyIds: number[];
  macros: [number, number, number, number];
};

export type ChefData = {
  userId: number;
  profile: Profile;
  pantry: PantryItem[];
  ingredients: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  allergens: { id: number; name: string }[];
  recipes: Recipe[];
  recommendedIds: string[];
};

export const defaultMacros: Profile['macros'] = [550, 35, 55, 20];
