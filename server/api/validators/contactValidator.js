import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

/**
 * Validation rules for the contact form submission
 */
export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject must be less than 200 characters'),
    
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message must be less than 2000 characters'),
    
  handleValidationErrors
];