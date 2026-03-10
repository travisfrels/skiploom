import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Layout from './components/Layout';
import Home from './components/Home';
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import MealPlanEntryForm from './components/MealPlanEntryForm';
import MealPlanning from './components/MealPlanning';
import ShoppingLists from './components/ShoppingLists';
import ShoppingListDetail from './components/ShoppingListDetail';
import ShoppingListForm from './components/ShoppingListForm';
import './App.css';
import * as ops from './operations';

function App() {
  const recipesLoaded = useAppSelector((state) => state.recipes.recipesLoaded);
  const featureFlagsLoaded = useAppSelector((state) => state.featureFlags.featureFlagsLoaded);

  useEffect(() => {
    ops.loadUser();
  }, []);

  useEffect(() => {
    if (!recipesLoaded) { ops.loadRecipes(); }
  }, [recipesLoaded]);

  useEffect(() => {
    if (!featureFlagsLoaded) { ops.loadFeatureFlags(); }
  }, [featureFlagsLoaded]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/new" element={<RecipeForm mode="new" />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="recipes/:id/edit" element={<RecipeForm mode="edit" />} />
          <Route path="meal-planning" element={<MealPlanning />} />
          <Route path="meal-planning/new" element={<MealPlanEntryForm mode="new" />} />
          <Route path="meal-planning/:id/edit" element={<MealPlanEntryForm mode="edit" />} />
          <Route path="shopping-lists" element={<ShoppingLists />} />
          <Route path="shopping-lists/new" element={<ShoppingListForm mode="new" />} />
          <Route path="shopping-lists/:id" element={<ShoppingListDetail />} />
          <Route path="shopping-lists/:id/edit" element={<ShoppingListForm mode="edit" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
