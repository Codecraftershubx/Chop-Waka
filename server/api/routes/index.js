import express from 'express';
import auth from './auth.js';
import menu from './menu.js';
import order from './order.js';
import user from './user.js';
import contact from './contact.js';
import reservation from './reservation.js';

const router = express.Router();

// Mount routes
router.use('/auth', auth);
router.use('/menu', menu);
router.use('/orders', order);
router.use('/users', user);
router.use('/contact', contact);
router.use('/reservations', reservation);

export default router;