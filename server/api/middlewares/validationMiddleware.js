import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  
  next();
};