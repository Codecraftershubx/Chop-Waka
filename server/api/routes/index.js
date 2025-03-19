import express from 'express';
import auth from './auth.js';
import menu from './menu.js';
import order from './order.js';
import user from './user.js';
import contact from './contact.js';
import reservation from './reservation.js';
import admin from './admin.js'

const router = express.Router();

// Mount routes
router.use('/auth', auth);
router.use('/menu', menu);
router.use('/orders', order);
router.use('/user', user);
router.use('/contact', contact);
router.use('/reservations', reservation);
router.use('/admin', admin);

export default router;