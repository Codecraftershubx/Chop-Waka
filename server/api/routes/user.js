import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Routes will be implemented later
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'Get all users' });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'Create user' });
  });

router.route('/:id')
  .get((req, res) => {
    res.status(200).json({ message: `Get user ${req.params.id}` });
  })
  .put((req, res) => {
    res.status(200).json({ message: `Update user ${req.params.id}` });
  })
  .delete((req, res) => {
    res.status(200).json({ message: `Delete user ${req.params.id}` });
  });

export default router;