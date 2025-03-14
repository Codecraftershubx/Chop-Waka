import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Protect routes - Authentication middleware
 * @desc Verifies JWT token and attaches user to request
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Find user and attach to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      // If user not found but token is valid
      if (!req.user) {
        logger.warn(`Valid token but user not found: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      logger.warn(`Authentication error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }
  }

  if (!token) {
    logger.warn(`Authentication attempt with no token: ${req.originalUrl}`);
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
});

/**
 * Authorize by role
 * @desc Middleware to restrict access based on user role
 * @param {...string} roles - Authorized roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Role authorization failed: ${req.user._id} (${req.user.role}) attempted to access ${req.originalUrl}`);
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this resource`
      });
    }
    
    next();
  };
};

export { protect, authorize };