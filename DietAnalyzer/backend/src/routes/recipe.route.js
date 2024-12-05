import express from 'express';
import { generateRecipes, getUserRecipes, getRecipeById } from '../controllers/recipe.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);


// Generate new recipes based on preferences and/or ingredients
router.post('/generate', generateRecipes);

// Get all recipes
router.get('/all', getUserRecipes);

// Get a specific recipe by ID
router.get('/:id', getRecipeById);

export default router;