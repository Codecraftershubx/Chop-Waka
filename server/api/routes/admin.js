import express from 'express';
import { validateContactForm } from '../validators/contactValidator.js';
import {protect, authorize} from '../middlewares/auth.js';
import { 
    getAllContacts, 
    getContact,
    updateContactStatus, 
    deleteContact 
  } from '../controllers/contactController.js';
  import { 
    getAllMenuItems, 
    getMenuItem, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
  } from '../controllers/menuItemController.js';
  import { getReservations } from '../controllers/reservation.js';

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole
} from '../controllers/userController.js';
import { validateMenuItem } from '../validators/menuItemValidator.js';
  

const router = express.Router();

// Protected routes - admin only
router.use(protect);
router.use(authorize('admin', 'manager'));

//contact
router.route('/contact')
  .get(getAllContacts);

router.route('/contact/:id')
  .get(getContact)
  .patch(updateContactStatus)
  .delete(deleteContact);

//Menu
router.route('/menu')
  .get(getAllMenuItems)
  .post(validateMenuItem, createMenuItem);

router.route('/menu/:id')
  .get(getMenuItem)
  .put(validateMenuItem, updateMenuItem)
  .delete(validateMenuItem, deleteMenuItem);

//Order
// router.get('/order')
// router.route('/order/:id')
//   .get(getOrder)
//   .patch(updateOrderStatus)
//   .delete(deleteOrder);

//Reservation
router.get('/reservation', getReservations);

//user
router.get('/user', authorize('admin', 'manager'), getUsers);
router.route('/user/:id')
  .get(authorize('admin', 'manager'), getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

router.put('/user/:id/role', authorize('admin'), changeUserRole);

export default router;