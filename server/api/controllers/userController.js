import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import Order from '../../models/Order.js';
import { sendEmail } from '../../utils/emailService.js';
import logger from '../../utils/logger.js';
import config from '../../config/index.js';

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;

  // Validation
  if (!name || !email || !password) {
    logger.warn('Registration attempt with missing fields');
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password'
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    logger.warn(`Registration attempt with existing email: ${email}`);
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Validate role - only admins can create users with elevated privileges
  const isAuthorized = req.user && ['admin', 'manager'].includes(req.user.role);
  if (['admin', 'manager', 'staff'].includes(role) && !isAuthorized) {
    logger.warn(`Unauthorized attempt to create ${role} account by ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to create this type of account'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || 'customer'
  });

  if (user) {
    logger.info(`New user registered: ${user._id} (${email})`);
    
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    logger.error(`Failed to register user: ${email}`);
    res.status(400).json({
      success: false,
      message: 'Invalid user data'
    });
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Find user by email (case insensitive)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  // Check if user exists and password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    logger.info(`User logged in: ${user._id} (${email})`);
    
    // Create refresh token
    const refreshToken = generateRefreshToken(user._id);
    
    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'strict'
    });
    
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    logger.warn(`Failed login attempt for ${email}`);
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  // Clear refresh token in database
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }
  
  // Clear cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  logger.info(`User logged out: ${req.user ? req.user._id : 'Unknown'}`);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/users/refresh-token
 * @access  Public (with refresh token cookie)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not found'
    });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    
    // Find user with matching refresh token
    const user = await User.findOne({
      _id: decoded.id,
      refreshToken
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    // Generate new access token
    const accessToken = generateToken(user._id);
    
    logger.info(`Token refreshed for user: ${user._id}`);
    
    res.json({
      success: true,
      data: {
        token: accessToken
      }
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } else {
    logger.error(`User not found: ${req.user._id}`);
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    logger.error(`Update profile failed - user not found: ${req.user._id}`);
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Update allowed fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();
  
  // If password is included, update it
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }
  
  // Save the updated user
  const updatedUser = await user.save();
  
  logger.info(`User profile updated: ${user._id}`);
  
  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filtering
  const filter = {};
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Query execution
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);
  
  // Response
  res.json({
    success: true,
    data: {
      count: users.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
        totalRecords: total
      },
      users
    }
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const user = await User.findById(req.params.id).select('-password');
  
  if (user) {
    res.json({
      success: true,
      data: user
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Prevent non-admin users from modifying admin accounts
  if (user.role === 'admin' && req.user.role !== 'admin') {
    logger.warn(`Unauthorized attempt to modify admin account by ${req.user._id}`);
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify admin accounts'
    });
  }
  
  // Update allowed fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email.toLowerCase();
  
  // Only allow role updates by admin
  if (req.body.role && req.user.role === 'admin') {
    user.role = req.body.role;
  }
  
  // If password is included, update it
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }
  
  // Save the updated user
  const updatedUser = await user.save();
  
  logger.info(`User updated by admin: ${user._id} (updated by ${req.user._id})`);
  
  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    }
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Prevent deleting another admin (admin can only be deleted by themselves)
  if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
    logger.warn(`Unauthorized attempt to delete admin account by ${req.user._id}`);
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete admin accounts'
    });
  }
  
  await user.deleteOne();
  
  logger.info(`User deleted: ${user._id} (deleted by ${req.user._id})`);
  
  res.json({
    success: true,
    message: 'User removed successfully'
  });
});

/**
 * @desc    Request password reset
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your email address'
    });
  }
  
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    // For security reasons, don't reveal that the email doesn't exist
    return res.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    });
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  await user.save({ validateBeforeSave: false });
  
  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;
  
  const message = `
    You requested a password reset. Please make a PUT request to:
    \n\n${resetUrl}
    \n\nIf you didn't request this, please ignore this email.
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message
    });
    
    logger.info(`Password reset email sent to: ${user.email}`);
    
    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    logger.error(`Error sending password reset email: ${error.message}`);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
});


/**
 * @desc    ChangePassword
 * @route   POST /api/users/change-password
 * @access  Private USER
 */

// const ChangePassword = asyncHandler(async (req, res) => {
//   const { old_password, new_password, confirm_password } = req.body;

//   if (!old_password || !new_password || !confirm_password) {
//     return res.status(401).json({
//       success: false,
//       message: 'All fields required'
//     })
//   if (req.user) {
//     $user = 
//   }
//   else {
//     return res.status(404).json({
//       success: false,
//       message: 'No user found'
//     })
//   }


//   }
// });


/**
 * @desc    Reset password
 * @route   PUT /api/users/reset-password/:resetToken
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
  
  // Set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();
  
  logger.info(`Password reset successful for: ${user.email}`);
  
  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});

/**
 * @desc    Change user role
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
const changeUserRole = asyncHandler(async (req, res) => {
  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID format'
    });
  }

  const { role } = req.body;
  
  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a role'
    });
  }
  
  // Validate role
  const validRoles = ['customer', 'staff', 'manager', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Role must be one of: ${validRoles.join(', ')}`
    });
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Only admin can create other admins
  if (role === 'admin' && req.user.role !== 'admin') {
    logger.warn(`Unauthorized attempt to promote user to admin by ${req.user._id}`);
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create admin accounts'
    });
  }
  
  user.role = role;
  await user.save();
  
  logger.info(`User role changed: ${user._id} to ${role} (by ${req.user._id})`);
  
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Generate JWT token
 * @param {string} id User ID
 * @returns {string} Generated JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

/**
 * Generate JWT refresh token
 * @param {string} id User ID
 * @returns {string} Generated JWT refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, config.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  });
};

// @desc  Get user all Order Records
// @route /api/v1/user/orders
// @access private

const getUserAllOrders = asyncHandler(async(req, res) => {
  const userloggedin = await User.findById(req.user._id);

  if (!userloggedin) {
    return res.status(404).json({
      success: false,
      message: 'Login to access your order records'
    });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit
  const filter = {user: req.user._id};

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination: {
      currentPAge: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + orders.length < total
    },
    data: orders
  });
});

// @desc    Get single order detail
// @route   GET /api/v1/order/:id
// @access  Private (User)

const getUserOrder = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || order.user !== req.user._id) {
    return res.status(200).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  })


})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  changeUserRole,
  getUserAllOrders,
  getUserOrder
};