import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {generateMealReport} from '../controllers/reportgenerate.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.post('/', generateMealReport);


export default router;