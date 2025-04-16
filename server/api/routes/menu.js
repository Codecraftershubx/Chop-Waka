import express from 'express';
import { 
  getAllMenuItems, 
  getMenuItem, 
  // createMenuItem, 
  // updateMenuItem, 
  // deleteMenuItem 
} from '../controllers/menuItemController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateMenuItem } from '../validators/menuItemValidator.js';

const router = express.Router();

// Public routes
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItem);

// Protected routes - admin/manager only
// router.use(protect);
// router.use(authorize('admin', 'manager'));

// router.post('/', validateMenuItem, createMenuItem);
// router.put('/:id', validateMenuItem, updateMenuItem);
// router.delete('/:id', deleteMenuItem);

export default router;