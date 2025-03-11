import express from 'express';
import { 
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  checkAvailability
} from '../controllers/reservation.js';
import { protect, authorize } from '../middlewares/auth.js';
import { 
  reservationValidators, 
  availabilityValidators,
  validateRequest 
} from '../middlewares/validators.js';

const router = express.Router();

// Public routes
router.post('/', reservationValidators, validateRequest, createReservation);
router.get('/availability', availabilityValidators, validateRequest, checkAvailability);

// Routes that may be public or protected depending on your requirements
router.route('/:id')
  .get(getReservation)
  .put(reservationValidators, validateRequest, updateReservation)
  .delete(cancelReservation);

// Protected routes for admin/manager
router.use(protect);
router.use(authorize('admin', 'manager'));
router.get('/', getReservations);

export default router;