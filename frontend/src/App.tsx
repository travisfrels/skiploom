import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/new" element={<RecipeForm />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="recipes/:id/edit" element={<RecipeForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
