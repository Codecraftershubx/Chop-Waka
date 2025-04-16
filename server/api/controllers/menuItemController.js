import MenuItem from '../../models/MenuItem.js';
import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/appError.js';
import { generateCacheKey } from '../services/cacheKeyGen.js';
import connectRedis from '../../config/redis.js';
import logger from '../../utils/logger.js';

const CACHE_TTL = 1800;
const redisClient = await connectRedis();

// @desc    Get all menu items with filtering
// @route   GET /api/v1/menu
// @access  Public
export const getAllMenuItems = asyncHandler(async (req, res) => {
  const cacheKey = generateCacheKey(req, 'menuItems');

  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    logger.info(`Data found in Redis: ${cacheKey}`);
    const parseData = JSON.parse(cachedData)
    return res.status(200).json({
      success: true,
      source: 'cache',
      ...parseData
    });
  }

  // Build query based on filter parameters
  let queryObj = {};
  
  // Filter by cuisine
  if (req.query.cuisine) {
    // Handle multiple cuisines separated by comma
    const cuisines = req.query.cuisine.split(',');
    queryObj.cuisine = { $in: cuisines };
  }
  
  // Filter by availability
  if (req.query.availability) {
    const availabilities = req.query.availability.split(',');
    queryObj.availability = { $in: availabilities };
  }
  
  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.basePrice = {};
    if (req.query.minPrice) queryObj.basePrice.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.basePrice.$lte = Number(req.query.maxPrice);
  }

  // Search by name or description
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    queryObj.$or = [
      { name: searchRegex },
      { description: searchRegex }
    ];
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;
  
  // Sort options
  let sort = {};
  if (req.query.sort) {
    if (req.query.sort === 'price-asc') sort = { basePrice: 1 };
    else if (req.query.sort === 'price-desc') sort = { basePrice: -1 };
    else if (req.query.sort === 'rating') sort = { rating: -1 };
    else if (req.query.sort === 'newest') sort = { createdAt: -1 };
  } else {
    // Default sort
    sort = { createdAt: -1 };
  }
  
  const menuItems = await MenuItem.find(queryObj).select('-createdAt')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await MenuItem.countDocuments(queryObj).select('-createdAt');

  const responseData = {
    count: menuItems.length,
    total,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + menuItems.length < total
    },
    data: menuItems
  };

  try {
    await redisClient.setEx(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(responseData)
    );
    logger.info(`Added to Redis Successfully: ${cacheKey}`);
  } catch (err) {
    logger.error(`Redis cache set error: ${err.message}`);
  }
  
  res.status(200).json({
    success: true,
    ...responseData
  });
});

// @desc    Get single menu item
// @route   GET /api/v1/menu/:id
// @access  Public
export const getMenuItem = asyncHandler(async (req, res, next) => {
  const itemId = req.params.id;
  const cacheKey = `menu:item:${itemId}`;

  try {
    const cacheItem = await redisClient.get(cacheKey);

    if (cacheItem) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: JSON.parse(cacheItem)
      });
    }
  } catch (err) {
    logger.error(`Redis cache error: ${err.message}`);
  }


  const menuItem = await MenuItem.findById(req.params.id);
  
  if (!menuItem) {
    return next(new AppError('Menu item not found', 404));
  }

  try {
    await redisClient.setEx(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(menuItem)
    )
    logger.info(`Add to redis ${cacheKey}`);
  } catch (err) {
    logger.error(`Redis cache set error: ${err.message}`);
  }
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Create menu item
// @route   POST /api/v1/menu
// @access  Private (Admin/Manager)
export const createMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.create(req.body);
  
  res.status(201).json({
    success: true,
    data: menuItem
  });
});

// @desc    Update menu item
// @route   PUT /api/v1/menu/:id
// @access  Private (Admin/Manager)
export const updateMenuItem = asyncHandler(async (req, res, next) => {
  const itemId = req.params.id;
  let menuItem = await MenuItem.findById(itemId);
  
  if (!menuItem) {
    return next(new AppError('Menu item not found', 404));
  }
  
  menuItem = await MenuItem.findByIdAndUpdate(itemId, req.body, {
    new: true,
    runValidators: true
  });

  try {
    await redisClient.del(`menu:item:${itemId}`);
    logger.info(`Deleted from Redis: menu:item:${itemId}`);
  }
  catch (err) {
    logger.error(`Redis cache delete error: ${err.message}`);
  }
  
  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Delete menu item
// @route   DELETE /api/v1/menu/:id
// @access  Private (Admin/Manager)
export const deleteMenuItem = asyncHandler(async (req, res, next) => {
  const itemId = req.params.id;
  const menuItem = await MenuItem.findById(itemId);
  
  if (!menuItem) {
    return next(new AppError('Menu item not found', 404));
  }
  
  await menuItem.deleteOne();
  
  try {
    await redisClient.del(`menu:item:${itemId}`);
    logger.info(`Deleted from Redis: menu:item:${itemId}`);
  } catch (err) {
    logger.error(`Redis cache delete error: ${err.message}`);
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});