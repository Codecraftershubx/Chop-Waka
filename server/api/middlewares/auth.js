import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/appError.js';
import config from '../../config/index.js';

// Protect routes - user must be logged in
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Or check if token exists in cookies
    token = req.cookies.token;
  }
  
  // Make sure token exists
  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Get user from the token id
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return next(new AppError('User not found', 404));
    }
    
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

// Optional authentication - allows both authenticated and guest users
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Or check if token exists in cookies
    token = req.cookies.token;
  }
  
  // If token exists, try to verify and attach user
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Get user from the token id
      req.user = await User.findById(decoded.id).select('-password');
      // Don't throw an error if user not found - just continue as guest
    } catch (error) {
      // Token invalid - continue as guest without throwing error
    }
  }
  
  // Continue to the next middleware
  next();
});

// Authorize certain roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(`Role ${req.user ? req.user.role : 'Guest'} is not authorized to access this route`, 403));
    }
    next();
  };
};