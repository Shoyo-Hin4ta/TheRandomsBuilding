import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeGeneration from './components/RecipeGeneration';
import DietaryRecipes from './components/RecipeGeneration/DietaryRecipes';
import IngredientRecipes from './components/RecipeGeneration/IngredientRecipes';
import AllRecipes from './components/RecipeGeneration/AllRecipes';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe-generation" element={<RecipeGeneration />} />
          <Route path="/dietary-recipes" element={<DietaryRecipes />} />
          <Route path="/ingredient-recipes" element={<IngredientRecipes />} />
          <Route path="/all-recipes" element={<AllRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;