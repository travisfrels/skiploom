const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  encodeRecipeData,
  buildImportUrl,
  handleRecipeResponse,
} = require('./popup.js');

const TEST_RECIPE = {
  title: 'Chocolate Cake',
  description: 'A rich chocolate cake',
  category: 'DESSERT',
  ingredients: [
    { orderIndex: 1, amount: 2, unit: 'cups', name: 'flour' },
    { orderIndex: 2, amount: 1, unit: 'cup', name: 'sugar' },
  ],
  steps: [
    { orderIndex: 1, instruction: 'Mix dry ingredients' },
    { orderIndex: 2, instruction: 'Add wet ingredients' },
    { orderIndex: 3, instruction: 'Bake at 350F for 30 minutes' },
  ],
};

describe('encodeRecipeData', () => {
  it('encodes recipe to a non-empty base64 string', () => {
    const encoded = encodeRecipeData(TEST_RECIPE);
    assert.equal(typeof encoded, 'string');
    assert.ok(encoded.length > 0);
  });

  it('round-trips back to the original recipe', () => {
    const encoded = encodeRecipeData(TEST_RECIPE);
    const bytes = Buffer.from(encoded, 'base64');
    const decoded = JSON.parse(bytes.toString('utf-8'));
    assert.deepEqual(decoded, TEST_RECIPE);
  });

  it('handles Unicode characters in title and description', () => {
    const recipe = {
      title: 'Cr\u00e8me Br\u00fbl\u00e9e',
      description: '\u00c9clairs with cr\u00e8me p\u00e2tissi\u00e8re',
      category: 'DESSERT',
      ingredients: [{ orderIndex: 1, amount: 1, unit: 'cup', name: 'cr\u00e8me' }],
      steps: [{ orderIndex: 1, instruction: 'Pr\u00e9parer la cr\u00e8me' }],
    };
    const encoded = encodeRecipeData(recipe);
    const bytes = Buffer.from(encoded, 'base64');
    const decoded = JSON.parse(bytes.toString('utf-8'));
    assert.deepEqual(decoded, recipe);
  });
});

describe('buildImportUrl', () => {
  it('constructs the import URL with base64 fragment', () => {
    const url = buildImportUrl('http://localhost:5173', TEST_RECIPE);
    assert.ok(url.startsWith('http://localhost:5173/recipes/import#data='));
    const fragment = url.split('#data=')[1];
    assert.ok(fragment.length > 0);
  });

  it('strips trailing slash from base URL', () => {
    const url = buildImportUrl('http://localhost:5173/', TEST_RECIPE);
    assert.ok(url.startsWith('http://localhost:5173/recipes/import#data='));
  });

  it('contains valid base64-encoded recipe in fragment', () => {
    const url = buildImportUrl('http://localhost:5173', TEST_RECIPE);
    const fragment = url.split('#data=')[1];
    const bytes = Buffer.from(fragment, 'base64');
    const decoded = JSON.parse(bytes.toString('utf-8'));
    assert.deepEqual(decoded, TEST_RECIPE);
  });
});

describe('handleRecipeResponse', () => {
  it('returns found result with stats when recipe is detected', () => {
    const response = { status: 'found', recipe: TEST_RECIPE };
    const result = handleRecipeResponse(response);
    assert.deepEqual(result, {
      found: true,
      recipe: TEST_RECIPE,
      title: 'Chocolate Cake',
      ingredientCount: 2,
      stepCount: 3,
    });
  });

  it('returns not found when status is not_found', () => {
    const result = handleRecipeResponse({ status: 'not_found' });
    assert.deepEqual(result, { found: false });
  });

  it('returns not found when response is undefined', () => {
    const result = handleRecipeResponse(undefined);
    assert.deepEqual(result, { found: false });
  });

  it('returns not found when response is null', () => {
    const result = handleRecipeResponse(null);
    assert.deepEqual(result, { found: false });
  });
});
