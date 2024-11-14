import express from 'express';
import { generateRecipes, getAllRecipes, getRecipeById } from '../controllers/recipe.controller.js';

const router = express.Router();

// Generate new recipes based on preferences or ingredients
router.post('/generate', generateRecipes);

// Get all recipes for the default user
router.get('/all', getAllRecipes);

// Get a specific recipe by ID
router.get('/:id', getRecipeById);

export default router;