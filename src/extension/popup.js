const DEFAULT_URL = "http://localhost:5173";

function encodeRecipeData(recipe) {
  const json = JSON.stringify(recipe);
  const utf8 = new TextEncoder().encode(json);
  const binary = String.fromCharCode(...utf8);
  return btoa(binary);
}

function buildImportUrl(baseUrl, recipe) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const encoded = encodeRecipeData(recipe);
  return `${cleanBase}/recipes/import#data=${encoded}`;
}

function handleRecipeResponse(response) {
  if (!response || response.status !== 'found') {
    return { found: false };
  }
  const recipe = response.recipe;
  return {
    found: true,
    recipe,
    title: recipe.title,
    ingredientCount: recipe.ingredients.length,
    stepCount: recipe.steps.length,
  };
}

// DOM interaction (runs only in browser)
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("status");
    const recipeInfo = document.getElementById("recipe-info");
    const recipeTitleEl = document.getElementById("recipe-title");
    const ingredientCountEl = document.getElementById("ingredient-count");
    const stepCountEl = document.getElementById("step-count");
    const importButton = document.getElementById("import-button");

    let currentRecipe = null;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) {
        statusEl.textContent = "No recipe found on this page";
        return;
      }
      chrome.tabs.sendMessage(tab.id, { type: "GET_RECIPE_DATA" }, (response) => {
        if (chrome.runtime.lastError) {
          statusEl.textContent = "No recipe found on this page";
          return;
        }
        const result = handleRecipeResponse(response);
        if (result.found) {
          currentRecipe = result.recipe;
          statusEl.style.display = "none";
          recipeInfo.style.display = "block";
          recipeTitleEl.textContent = result.title;
          ingredientCountEl.textContent = result.ingredientCount;
          stepCountEl.textContent = result.stepCount;
        } else {
          statusEl.textContent = "No recipe found on this page";
        }
      });
    });

    importButton.addEventListener("click", () => {
      if (!currentRecipe) return;
      chrome.storage.sync.get({ skiploomUrl: DEFAULT_URL }, (settings) => {
        const url = buildImportUrl(settings.skiploomUrl, currentRecipe);
        chrome.tabs.create({ url });
      });
    });
  });
}

// Conditional export for Node.js testing
if (typeof module !== 'undefined') {
  module.exports = {
    encodeRecipeData,
    buildImportUrl,
    handleRecipeResponse,
  };
}
