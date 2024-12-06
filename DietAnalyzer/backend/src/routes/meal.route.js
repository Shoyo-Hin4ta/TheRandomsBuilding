import express from 'express';
import {
  addMeal,
  getMealsByDate,
  updateMeal,
  deleteMeal,
  getNutritionData
} from '../controllers/meal.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.use(verifyJWT);


// Routes without auth middleware
router.post('/', upload.single('image'), addMeal);
router.get('/date/:date', getMealsByDate);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);
router.get('/nutrition', getNutritionData);


export default router;