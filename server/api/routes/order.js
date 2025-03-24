import express from 'express';
import { protect } from '../middlewares/auth.js';
import { createOrder, getAllOrders, getOrderDetail } from '../controllers/order.js';

const router = express.Router();

// Routes will be implemented later
router.use(protect);
router.route('/')
  .get(getAllOrders)
  .post(createOrder);

router.get('/:id', getOrderDetail);

export default router;