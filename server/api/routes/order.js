import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Routes will be implemented later
router.route('/')
  .get(protect, (req, res) => {
    res.status(200).json({ message: 'Get all orders' });
  })
  .post(protect, (req, res) => {
    res.status(201).json({ message: 'Create order' });
  });

router.route('/:id')
  .get(protect, (req, res) => {
    res.status(200).json({ message: `Get order ${req.params.id}` });
  })
  .put(protect, (req, res) => {
    res.status(200).json({ message: `Update order ${req.params.id}` });
  })
  .delete(protect, authorize('admin', 'manager'), (req, res) => {
    res.status(200).json({ message: `Delete order ${req.params.id}` });
  });

export default router;