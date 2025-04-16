import express from 'express';
import { protect } from '../middlewares/auth.js';
import { placeOrder, getAllOrders, getOrderDetail } from '../controllers/order.js';

const router = express.Router();

router.post('/', placeOrder);
router.get('/:id', getOrderDetail);
router.get('/', protect, getAllOrders)
// Routes will be implemented later

export default router;