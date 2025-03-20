import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

export const validateMenuItem = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  
  body('basePrice')
    .notEmpty().withMessage('Base price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('image')
    .trim()
    .notEmpty().withMessage('Image URL is required')
    .isURL().withMessage('Please provide a valid image URL'),
  
  body('cuisine')
    .trim()
    .notEmpty().withMessage('Cuisine is required')
    .isIn(['Yoruba', 'Igbo', 'Hausa', 'Edo', 'American'])
    .withMessage('Invalid cuisine type'),
  
  body('availability')
    .trim()
    .optional()
    .isIn(['Available Now', 'Limited Quantity', 'Pre-Order', 'Sold Out'])
    .withMessage('Invalid availability status'),
  
  body('customizationOptions.sizes.*.id')
    .optional()
    .isString().withMessage('Size ID must be a string'),
  
  body('customizationOptions.sizes.*.name')
    .optional()
    .isString().withMessage('Size name must be a string'),
  
  body('customizationOptions.sizes.*.priceAdjustment')
    .optional()
    .isFloat().withMessage('Price adjustment must be a number'),
  
  body('customizationOptions.toppings.*.id')
    .optional()
    .isNumeric().withMessage('Topping ID must be a number'),
  
  body('customizationOptions.toppings.*.name')
    .optional()
    .isString().withMessage('Topping name must be a string'),
  
  body('customizationOptions.toppings.*.price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Topping price must be a positive number'),
  
  handleValidationErrors
];