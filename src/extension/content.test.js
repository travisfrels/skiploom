const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  parseAmount,
  parseIngredient,
  parseInstructions,
  mapCategory,
  findRecipeObject,
  extractRecipe,
} = require('./content.js');

describe('parseAmount', () => {
  it('parses whole numbers', () => {
    assert.equal(parseAmount('2'), 2);
  });

  it('parses decimals', () => {
    assert.equal(parseAmount('1.5'), 1.5);
  });

  it('parses simple fractions', () => {
    assert.equal(parseAmount('1/2'), 0.5);
  });

  it('parses mixed numbers', () => {
    assert.equal(parseAmount('2 1/2'), 2.5);
  });

  it('parses fraction 1/3', () => {
    assert.ok(Math.abs(parseAmount('1/3') - 1 / 3) < 0.001);
  });

  it('parses mixed number 1 3/4', () => {
    assert.equal(parseAmount('1 3/4'), 1.75);
  });
});

describe('parseIngredient', () => {
  it('parses standard format "1 cup flour"', () => {
    assert.deepEqual(parseIngredient('1 cup flour'), {
      amount: 1,
      unit: 'cup',
      name: 'flour',
    });
  });

  it('parses fraction "1/2 teaspoon salt"', () => {
    assert.deepEqual(parseIngredient('1/2 teaspoon salt'), {
      amount: 0.5,
      unit: 'teaspoon',
      name: 'salt',
    });
  });

  it('parses mixed number "2 1/2 cups sugar"', () => {
    assert.deepEqual(parseIngredient('2 1/2 cups sugar'), {
      amount: 2.5,
      unit: 'cups',
      name: 'sugar',
    });
  });

  it('parses decimal "1.5 oz cheese"', () => {
    assert.deepEqual(parseIngredient('1.5 oz cheese'), {
      amount: 1.5,
      unit: 'oz',
      name: 'cheese',
    });
  });

  it('parses multi-word name "2 cups all-purpose flour"', () => {
    assert.deepEqual(parseIngredient('2 cups all-purpose flour'), {
      amount: 2,
      unit: 'cups',
      name: 'all-purpose flour',
    });
  });

  it('falls back for no-number string "salt to taste"', () => {
    assert.deepEqual(parseIngredient('salt to taste'), {
      amount: 0,
      unit: '',
      name: 'salt to taste',
    });
  });

  it('falls back for single word "water"', () => {
    assert.deepEqual(parseIngredient('water'), {
      amount: 0,
      unit: '',
      name: 'water',
    });
  });

  it('trims whitespace', () => {
    assert.deepEqual(parseIngredient('  1 cup flour  '), {
      amount: 1,
      unit: 'cup',
      name: 'flour',
    });
  });

  it('falls back for number-only "3"', () => {
    assert.deepEqual(parseIngredient('3'), {
      amount: 0,
      unit: '',
      name: '3',
    });
  });
});

describe('parseInstructions', () => {
  it('returns empty array for null', () => {
    assert.deepEqual(parseInstructions(null), []);
  });

  it('returns empty array for undefined', () => {
    assert.deepEqual(parseInstructions(undefined), []);
  });

  it('handles array of HowToStep objects', () => {
    const input = [
      { '@type': 'HowToStep', text: 'Preheat oven.' },
      { '@type': 'HowToStep', text: 'Mix ingredients.' },
    ];
    assert.deepEqual(parseInstructions(input), [
      'Preheat oven.',
      'Mix ingredients.',
    ]);
  });

  it('handles array of strings', () => {
    assert.deepEqual(parseInstructions(['Step one', 'Step two']), [
      'Step one',
      'Step two',
    ]);
  });

  it('handles single string split on newlines', () => {
    assert.deepEqual(parseInstructions('Step one\nStep two\nStep three'), [
      'Step one',
      'Step two',
      'Step three',
    ]);
  });

  it('filters empty lines from string', () => {
    assert.deepEqual(parseInstructions('Step one\n\nStep two\n'), [
      'Step one',
      'Step two',
    ]);
  });

  it('handles HowToStep with name fallback', () => {
    const input = [{ '@type': 'HowToStep', name: 'Stir well' }];
    assert.deepEqual(parseInstructions(input), ['Stir well']);
  });

  it('filters empty strings from array', () => {
    assert.deepEqual(parseInstructions(['Step one', '', 'Step two']), [
      'Step one',
      'Step two',
    ]);
  });

  it('trims whitespace from array elements', () => {
    assert.deepEqual(parseInstructions(['  Step one  ', '  Step two  ']), [
      'Step one',
      'Step two',
    ]);
  });
});

describe('mapCategory', () => {
  it('returns null for null', () => {
    assert.equal(mapCategory(null), null);
  });

  it('returns null for undefined', () => {
    assert.equal(mapCategory(undefined), null);
  });

  it('returns null for empty string', () => {
    assert.equal(mapCategory(''), null);
  });

  it('maps "dessert" to DESSERT', () => {
    assert.equal(mapCategory('dessert'), 'DESSERT');
  });

  it('maps "Dessert" case-insensitively', () => {
    assert.equal(mapCategory('Dessert'), 'DESSERT');
  });

  it('maps "dinner" to MAIN', () => {
    assert.equal(mapCategory('dinner'), 'MAIN');
  });

  it('maps "main course" to MAIN', () => {
    assert.equal(mapCategory('main course'), 'MAIN');
  });

  it('maps "soups" to SOUP', () => {
    assert.equal(mapCategory('soups'), 'SOUP');
  });

  it('maps "brunch" to BREAKFAST', () => {
    assert.equal(mapCategory('brunch'), 'BREAKFAST');
  });

  it('maps "cocktail" to COCKTAIL', () => {
    assert.equal(mapCategory('cocktail'), 'COCKTAIL');
  });

  it('maps "drink" to COCKTAIL', () => {
    assert.equal(mapCategory('drink'), 'COCKTAIL');
  });

  it('returns null for unmapped value', () => {
    assert.equal(mapCategory('Mediterranean'), null);
  });

  it('uses first element when given an array', () => {
    assert.equal(mapCategory(['dessert', 'baking']), 'DESSERT');
  });

  it('returns null for array with unmapped first element', () => {
    assert.equal(mapCategory(['Italian']), null);
  });

  it('trims whitespace', () => {
    assert.equal(mapCategory('  dessert  '), 'DESSERT');
  });
});

describe('findRecipeObject', () => {
  it('finds direct Recipe object', () => {
    const parsed = [{ '@type': 'Recipe', name: 'Cake' }];
    const result = findRecipeObject(parsed);
    assert.equal(result.name, 'Cake');
  });

  it('finds Recipe nested in @graph', () => {
    const parsed = [
      {
        '@graph': [
          { '@type': 'WebPage', name: 'Page' },
          { '@type': 'Recipe', name: 'Cake' },
        ],
      },
    ];
    const result = findRecipeObject(parsed);
    assert.equal(result.name, 'Cake');
  });

  it('handles @type as array', () => {
    const parsed = [{ '@type': ['Recipe', 'CreativeWork'], name: 'Cake' }];
    const result = findRecipeObject(parsed);
    assert.equal(result.name, 'Cake');
  });

  it('returns null when no Recipe found', () => {
    const parsed = [{ '@type': 'Organization', name: 'Corp' }];
    assert.equal(findRecipeObject(parsed), null);
  });

  it('returns null for empty array', () => {
    assert.equal(findRecipeObject([]), null);
  });

  it('returns first Recipe when multiple exist', () => {
    const parsed = [
      { '@type': 'Recipe', name: 'First' },
      { '@type': 'Recipe', name: 'Second' },
    ];
    const result = findRecipeObject(parsed);
    assert.equal(result.name, 'First');
  });

  it('finds Recipe in @graph with @type as array', () => {
    const parsed = [
      {
        '@graph': [
          { '@type': ['Recipe', 'Thing'], name: 'Cake' },
        ],
      },
    ];
    const result = findRecipeObject(parsed);
    assert.equal(result.name, 'Cake');
  });

  it('skips non-Recipe @graph entries', () => {
    const parsed = [
      {
        '@graph': [
          { '@type': 'Organization', name: 'Corp' },
          { '@type': 'WebPage', name: 'Page' },
        ],
      },
    ];
    assert.equal(findRecipeObject(parsed), null);
  });
});

describe('extractRecipe', () => {
  it('extracts full recipe', () => {
    const recipeObj = {
      '@type': 'Recipe',
      name: 'Chocolate Cake',
      description: 'A rich chocolate cake',
      recipeCategory: 'Dessert',
      recipeIngredient: ['2 cups flour', '1 cup sugar'],
      recipeInstructions: [
        { '@type': 'HowToStep', text: 'Preheat oven.' },
        { '@type': 'HowToStep', text: 'Mix ingredients.' },
      ],
    };
    const result = extractRecipe(recipeObj);
    assert.equal(result.title, 'Chocolate Cake');
    assert.equal(result.description, 'A rich chocolate cake');
    assert.equal(result.category, 'DESSERT');
    assert.equal(result.ingredients.length, 2);
    assert.deepEqual(result.ingredients[0], {
      orderIndex: 1,
      amount: 2,
      unit: 'cups',
      name: 'flour',
    });
    assert.deepEqual(result.ingredients[1], {
      orderIndex: 2,
      amount: 1,
      unit: 'cup',
      name: 'sugar',
    });
    assert.equal(result.steps.length, 2);
    assert.deepEqual(result.steps[0], {
      orderIndex: 1,
      instruction: 'Preheat oven.',
    });
  });

  it('handles missing optional fields', () => {
    const recipeObj = {
      '@type': 'Recipe',
      name: 'Simple Recipe',
    };
    const result = extractRecipe(recipeObj);
    assert.equal(result.title, 'Simple Recipe');
    assert.equal(result.description, null);
    assert.equal(result.category, null);
    assert.deepEqual(result.ingredients, []);
    assert.deepEqual(result.steps, []);
  });

  it('handles missing name', () => {
    const recipeObj = { '@type': 'Recipe' };
    const result = extractRecipe(recipeObj);
    assert.equal(result.title, '');
  });
});
