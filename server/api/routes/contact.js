import express from 'express';
import { 
  createContact, 
  getAllContacts, 
  getContact,
  updateContactStatus, 
  deleteContact 
} from '../controllers/contactController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateContactForm } from '../validators/contactValidator.js';

const router = express.Router();

// Public routes
router.post('/', validateContactForm, createContact);

// Protected routes - admin only
router.use(protect);
router.use(authorize('admin', 'manager'));

router.route('/')
  .get(getAllContacts);

router.route('/:id')
  .get(getContact)
  .patch(updateContactStatus)
  .delete(deleteContact);

export default router;