import { describe, it, expect } from 'vitest';
import { parseRecipeFragment } from './recipeImport';

function encode(data: unknown): string {
  const json = JSON.stringify(data);
  const utf8 = new TextEncoder().encode(json);
  const binary = String.fromCharCode(...utf8);
  return btoa(binary);
}

const FULL_RECIPE = {
  title: 'Chocolate Cake',
  description: 'A rich chocolate cake',
  category: 'DESSERT',
  ingredients: [
    { orderIndex: 1, amount: 2, unit: 'cups', name: 'flour' },
    { orderIndex: 2, amount: 0.5, unit: 'cup', name: 'cocoa powder' },
  ],
  steps: [
    { orderIndex: 1, instruction: 'Preheat oven to 350°F' },
    { orderIndex: 2, instruction: 'Mix dry ingredients' },
  ],
};

describe('parseRecipeFragment', () => {
  it('parses valid base64 JSON with all fields', () => {
    const hash = `#data=${encode(FULL_RECIPE)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe('Chocolate Cake');
    expect(result.data.description).toBe('A rich chocolate cake');
    expect(result.data.category).toBe('DESSERT');
    expect(result.data.ingredients).toEqual([
      { orderIndex: 1, amount: 2, unit: 'cups', name: 'flour' },
      { orderIndex: 2, amount: 0.5, unit: 'cup', name: 'cocoa powder' },
    ]);
    expect(result.data.steps).toEqual([
      { orderIndex: 1, instruction: 'Preheat oven to 350°F' },
      { orderIndex: 2, instruction: 'Mix dry ingredients' },
    ]);
  });

  it('defaults missing optional fields', () => {
    const recipe = {
      title: 'Simple Recipe',
      description: null,
      category: null,
      ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'water' }],
      steps: [{ orderIndex: 1, instruction: 'Boil water' }],
    };
    const hash = `#data=${encode(recipe)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.description).toBe('');
    expect(result.data.category).toBe('');
  });

  it('defaults missing description and category keys', () => {
    const recipe = {
      title: 'Minimal Recipe',
      ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'water' }],
      steps: [{ orderIndex: 1, instruction: 'Boil water' }],
    };
    const hash = `#data=${encode(recipe)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.description).toBe('');
    expect(result.data.category).toBe('');
  });

  it('returns error for empty hash', () => {
    const result = parseRecipeFragment('');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBeTruthy();
  });

  it('returns error for hash without data= prefix', () => {
    const result = parseRecipeFragment('#something=else');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBeTruthy();
  });

  it('returns error for malformed base64', () => {
    const result = parseRecipeFragment('#data=!!!not-valid-base64!!!');
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBeTruthy();
  });

  it('returns error for valid base64 but invalid JSON', () => {
    const result = parseRecipeFragment(`#data=${btoa('not json')}`);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toBeTruthy();
  });

  it('handles empty ingredients and steps arrays', () => {
    const recipe = {
      title: 'Empty Lists',
      ingredients: [],
      steps: [],
    };
    const hash = `#data=${encode(recipe)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.ingredients).toEqual([]);
    expect(result.data.steps).toEqual([]);
  });

  it('defaults unrecognized category to empty string', () => {
    const recipe = {
      title: 'Unknown Category',
      category: 'EXOTIC',
      ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'water' }],
      steps: [{ orderIndex: 1, instruction: 'Boil' }],
    };
    const hash = `#data=${encode(recipe)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.category).toBe('');
  });

  it('handles hash without leading #', () => {
    const hash = `data=${encode(FULL_RECIPE)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe('Chocolate Cake');
  });

  it('defaults ingredient fields when missing', () => {
    const recipe = {
      title: 'Sparse Ingredients',
      ingredients: [{ orderIndex: 1, name: 'salt' }],
      steps: [{ orderIndex: 1, instruction: 'Add salt' }],
    };
    const hash = `#data=${encode(recipe)}`;
    const result = parseRecipeFragment(hash);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.ingredients[0].amount).toBe(0);
    expect(result.data.ingredients[0].unit).toBe('');
  });
});
