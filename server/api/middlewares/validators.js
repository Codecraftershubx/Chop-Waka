import { body, query, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Reservation validators
export const reservationValidators = [
  body('date')
    .not().isEmpty().withMessage('Date is required')
    .custom(value => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reservationDate = new Date(value);
      
      if (reservationDate < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  
  body('time')
    .not().isEmpty().withMessage('Time is required'),
  
  body('partySize')
    .isInt({ min: 1, max: 20 }).withMessage('Party size must be between 1 and 20 people'),
  
  body('name')
    .trim()
    .not().isEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail(),
  
  body('phone')
    .not().isEmpty().withMessage('Phone number is required')
    .isLength({ max: 20 }).withMessage('Phone number cannot exceed 20 characters'),
  
  body('seats')
    .isArray({ min: 1 }).withMessage('At least one seat must be selected'),
  
  body('specialRequests')
    .optional()
    .isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters')
];

// Availability check validators
export const availabilityValidators = [
  query('date')
    .not().isEmpty().withMessage('Date is required')
    .isDate().withMessage('Date must be a valid date'),
  
  query('time')
    .not().isEmpty().withMessage('Time is required')
];