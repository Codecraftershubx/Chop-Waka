import Contact from '../../models/Contact.js';
import asyncHandler from '../../utils/asyncHandler.js';
import AppError from '../../utils/appError.js';

// @desc    Create a new contact message
// @route   POST /api/v1/contact
// @access  Public
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message
  });

  res.status(201).json({
    success: true,
    data: contact,
    message: 'Your message has been sent successfully!'
  });
});

// @desc    Get all contact messages
// @route   GET /api/v1/contact
// @access  Private (Admin)
export const getAllContacts = asyncHandler(async (req, res) => {
  // Implement pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  // Optional filtering by status
  const filter = req.query.status ? { status: req.query.status } : {};
  
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  // Get total count for pagination info
  const total = await Contact.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + contacts.length < total
    },
    data: contacts
  });
});

// @desc    Get single contact message
// @route   GET /api/v1/contact/:id
// @access  Private (Admin)
export const getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return next(new AppError('Contact message not found', 404));
  }
  
  // If status is unread, mark as read
  if (contact.status === 'unread') {
    contact.status = 'read';
    await contact.save();
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Update contact status
// @route   PATCH /api/v1/contact/:id
// @access  Private (Admin)
export const updateContactStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  
  if (!['unread', 'read', 'responded', 'archived'].includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }
  
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  
  if (!contact) {
    return next(new AppError('Contact message not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact message
// @route   DELETE /api/v1/contact/:id
// @access  Private (Admin)
export const deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    return next(new AppError('Contact message not found', 404));
  }
  
  await contact.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});