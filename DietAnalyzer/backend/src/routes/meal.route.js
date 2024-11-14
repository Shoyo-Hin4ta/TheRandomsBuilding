import express from 'express';
import {
  addMeal,
  getMealsByDate,
  updateMeal,
  deleteMeal
} from '../controllers/meal.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Routes without auth middleware
router.post('/', upload.single('image'), addMeal);
router.get('/date/:date', getMealsByDate);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);

export default router;