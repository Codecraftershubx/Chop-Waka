import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

import {registerUser, loginUser, getUserProfile, logoutUser, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile)
router.post('/profile', protect, updateUserProfile)
// router.get('/me', protect, getMe);

export default router;