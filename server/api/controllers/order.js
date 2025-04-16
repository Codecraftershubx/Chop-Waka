import asyncHandler from '../../utils/asyncHandler.js';
import Order from '../../models/Order.js'
import MenuItem from '../../models/MenuItem.js';
import AppError from '../../utils/appError.js';
import mongoose from 'mongoose';

// @desc    create a new order
// @route   POST /api/v1/order
// @access  Public

export const placeOrder = asyncHandler(async (req, res) => {
    const {cartItems, deliveryDetails, paymentMethod} = req.body;

    if (!cartItems || !deliveryDetails || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all the required fields'
        });
    }

    let totalAmount = 0;

    const orderItems = [];

    await Promise.all(cartItems.items.map(async (item) => {

        const itemInfo = await MenuItem.findById(item.id);

        if (!itemInfo) {
            return new AppError('Menu item not found', 404);
        }

        let itemPrice = itemInfo.basePrice;
        const customizations = item.customizations || {};

        if (customizations.size) {
            const selectedSize = itemInfo.customizationOptions.sizes.find(
                size => size.id == customizations.size);
            if (selectedSize) {
                itemPrice += selectedSize.priceAdjustment;
            }
        }

        if (customizations.soup) {
            const selectedSoup = itemInfo.customizationOptions.soups.find(
                soup => soup.id == customizations.soup
            );
            if (selectedSoup) {
                itemPrice += selectedSoup.priceAdjustment;
            }
        }

        if (customizations.toppings && Array.isArray(customizations.toppings)) {
            customizations.toppings.forEach(toppingId => {
                const selectedTopping = itemInfo.customizationOptions.toppings.find(
                    topping => topping.id == toppingId
                );
                if (selectedTopping) {
                    itemPrice += selectedTopping.price;
                }
            });
        }
        const itemTotal = itemPrice * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            menuItem: itemInfo._id,
            menuItemData: {
                name: itemInfo.name,
                price: itemInfo.basePrice
            },
            customizations: customizations,
            quantity: item.quantity,
            price: itemPrice,
            total: itemTotal
        });
    }));

    console.log(orderItems);



    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        deliveryDetails,
        totalAmount,
        paymentMethod,
        status: 'pending',
        paymentStatus: 'pending',
        specialInstructions: req.body.specialInstructions || ''
    });


    if (!order) {
        return new AppError('Order cannot be created', 404);
    }

    res.status(201).json({
        success: true,
        data: order,
        message: 'Order placed'
    });
});

// @desc    Get all Orders
// @route   GET /api/v1/order
// @access  privte (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
    if (!req.user) {
        return new AppError('User not found', 404);
    }
    const filterObj = {};
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    //optional filtering

    if (req.query.date) {
        const date = req.query.date;
        filterObj.date =  {date};
    }

    if (req.query.order_no) {
        const order_no = req.query.order_no;
        filterObj.order_no = {order_no};
    }

    if (req.query.status) {
        const status = req.query.status;
        filterObj.status = {status};
    }

    if (req.query.hour) {
        const hour = req.query.hour;
        filterObj.hour = {hour};
    }

    const userId = req.user._id;
    filterObj.user = userId;

    const orders = await Order.find(filterObj)
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit);

    if (!orders) {
        return new AppError('Order not found', 404);
    }
    
    const total = await Order.countDocuments(filterObj);

    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        pagination: {
            currentPage: page,
            totalpages: Math.ceil(total/ limit),
            hasMore: skip + orders.length < total
        },
        data: orders
    }); 

});

// @desc    Get single order detail
// @route   GET /api/v1/order/:id
// @access  Private
export const getOrderDetail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Order ID not provided', 400));
    }
    const orderDetail = await Order.findById(id);

    if (!orderDetail) {
        return next(new AppError('Order detail not found', 404));
    }

    res.status(200).json({
        success: true,
        data: orderDetail
    });
});

// @desc    Delete Order
// @route   DELETE /api/v1/order/:id
// @access  Private

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Menu item not found', 404));
  }
  
  await Order.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});


