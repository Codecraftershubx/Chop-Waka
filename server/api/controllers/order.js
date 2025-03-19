import express from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import Order from '../../models/Order.js'
import AppError from '../../utils/appError.js';

// @desc    create a new order
// @route   POST /api/v1/order
// @access  Public

export const createOrder = asyncHandler(async (req, res) => {
    const {delivery_method,
        delivery_detail,
        delivery_time,
        payment_method,
        cartItems
    } = req.body;

    const order = await Order.create({
        cartItems,
        delivery_detail,
        delivery_time,
        payment_method,
        status:'pending'
    })

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
    const orderDetail = await Order.findById(req.params.id);

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


