import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  changeUserRole
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.use(protect); // All routes below this require authentication

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/logout', logoutUser);

// Admin routes
router.get('/', authorize('admin', 'manager'), getUsers);
router.route('/:id')
  .get(authorize('admin', 'manager'), getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.put('/:id/role', authorize('admin'), changeUserRole);

export default router;