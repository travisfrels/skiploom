import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Layout from './components/Layout';
import Home from './components/Home';
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
