import express from 'express';
import { signUp, signIn, logout, refreshAccessToken } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', verifyJWT, logout);
router.post('/refresh-token', refreshAccessToken);

export default router;