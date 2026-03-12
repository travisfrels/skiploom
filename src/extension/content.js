const CATEGORY_MAP = {
  'main': 'MAIN',
  'main course': 'MAIN',
  'main dish': 'MAIN',
  'dinner': 'MAIN',
  'lunch': 'MAIN',
  'entree': 'MAIN',
  'entrée': 'MAIN',
  'side': 'SIDE',
  'side dish': 'SIDE',
  'dessert': 'DESSERT',
  'desserts': 'DESSERT',
  'appetizer': 'APPETIZER',
  'appetizers': 'APPETIZER',
  'starter': 'APPETIZER',
  'starters': 'APPETIZER',
  'soup': 'SOUP',
  'soups': 'SOUP',
  'stew': 'SOUP',
  'salad': 'SALAD',
  'salads': 'SALAD',
  'breakfast': 'BREAKFAST',
  'brunch': 'BREAKFAST',
  'snack': 'SNACK',
  'snacks': 'SNACK',
  'cocktail': 'COCKTAIL',
  'cocktails': 'COCKTAIL',
  'drink': 'COCKTAIL',
  'drinks': 'COCKTAIL',
  'beverage': 'COCKTAIL',
  'beverages': 'COCKTAIL',
};

const INGREDIENT_REGEX = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\.?\d*)\s+(\S+)\s+(.+)$/;

function parseAmount(str) {
  if (str.includes(' ') && str.includes('/')) {
    const spaceIndex = str.indexOf(' ');
    const whole = parseInt(str.substring(0, spaceIndex), 10);
    const fractionPart = str.substring(spaceIndex + 1);
    const [num, den] = fractionPart.split('/');
    return whole + parseInt(num, 10) / parseInt(den, 10);
  }
  if (str.includes('/')) {
    const [num, den] = str.split('/');
    return parseInt(num, 10) / parseInt(den, 10);
  }
  return parseFloat(str) || 0;
}

function parseIngredient(str) {
  const trimmed = str.trim();
  const match = trimmed.match(INGREDIENT_REGEX);
  if (match) {
    return {
      amount: parseAmount(match[1]),
      unit: match[2],
      name: match[3],
    };
  }
  return { amount: 0, unit: '', name: trimmed };
}

function parseInstructions(raw) {
  if (raw == null) {
    return [];
  }
  if (typeof raw === 'string') {
    return raw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  }
  if (Array.isArray(raw)) {
    return raw
      .map(item => {
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'object' && item !== null) {
          return (item.text || item.name || '').trim();
        }
        return '';
      })
      .filter(s => s.length > 0);
  }
  return [];
}

function mapCategory(rawCategory) {
  if (!rawCategory) return null;
  const value = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  if (!value) return null;
  const normalized = String(value).toLowerCase().trim();
  return CATEGORY_MAP[normalized] || null;
}

function isRecipeType(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const type = obj['@type'];
  if (type === 'Recipe') return true;
  if (Array.isArray(type) && type.includes('Recipe')) return true;
  return false;
}

function findRecipeObject(parsedObjects) {
  for (const obj of parsedObjects) {
    if (isRecipeType(obj)) return obj;
    if (Array.isArray(obj['@graph'])) {
      for (const entry of obj['@graph']) {
        if (isRecipeType(entry)) return entry;
      }
    }
  }
  return null;
}

function extractRecipe(recipeObj) {
  return {
    title: recipeObj.name || '',
    description: recipeObj.description || null,
    category: mapCategory(recipeObj.recipeCategory),
    ingredients: (recipeObj.recipeIngredient || []).map((str, i) => ({
      orderIndex: i + 1,
      ...parseIngredient(String(str)),
    })),
    steps: parseInstructions(recipeObj.recipeInstructions).map((str, i) => ({
      orderIndex: i + 1,
      instruction: str,
    })),
  };
}

function findJsonLdScripts() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  const parsed = [];
  for (const script of scripts) {
    try {
      parsed.push(JSON.parse(script.textContent));
    } catch (_) {
      // Skip malformed JSON-LD
    }
  }
  return parsed;
}

// Proactive extraction on page load
const cachedRecipe = (() => {
  if (typeof document === 'undefined') return null;
  const parsed = findJsonLdScripts();
  const recipeObj = findRecipeObject(parsed);
  return recipeObj ? extractRecipe(recipeObj) : null;
})();

// Message handler
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_RECIPE_DATA') {
      if (cachedRecipe) {
        sendResponse({ status: 'found', recipe: cachedRecipe });
      } else {
        sendResponse({ status: 'not_found' });
      }
    }
  });
}

// Conditional export for Node.js testing
if (typeof module !== 'undefined') {
  module.exports = {
    parseAmount,
    parseIngredient,
    parseInstructions,
    mapCategory,
    findRecipeObject,
    extractRecipe,
  };
}
