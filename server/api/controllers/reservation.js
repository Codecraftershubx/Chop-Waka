import { Reservation } from '../../models/index.js';

// @desc    Create new reservation
// @route   POST /api/v1/reservations
// @access  Public
export const createReservation = async (req, res, next) => {
  try {
    const { 
      date, 
      time, 
      partySize, 
      name, 
      email, 
      phone, 
      specialRequests, 
      seats 
    } = req.body;

    // Check if there's a conflicting reservation
    // This is a simplified example - you might want more complex logic here
    const reservationDate = new Date(date);
    const startHour = time.split(':')[0];
    const endHour = parseInt(startHour) + 2; // Assuming 2-hour reservation slots
    
    // Check if selected seats are available
    const conflictingReservation = await Reservation.findOne({
      date: {
        $gte: new Date(reservationDate.setHours(startHour, 0, 0)),
        $lte: new Date(reservationDate.setHours(endHour, 0, 0))
      },
      seats: { $in: seats },
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingReservation) {
      return res.status(400).json({
        success: false,
        error: 'One or more selected seats are already reserved for this time'
      });
    }

    // Create reservation
    const reservation = await Reservation.create({
      date,
      time,
      partySize,
      name,
      email,
      phone,
      specialRequests,
      seats,
      user: req.user ? req.user.id : null // If authenticated
    });

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations
// @route   GET /api/v1/reservations
// @access  Private (Admin/Manager)
export const getReservations = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Date filtering
    let query = {};
    if (req.query.date) {
      const date = new Date(req.query.date);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: date,
        $lt: nextDay
      };
    }
    
    const total = await Reservation.countDocuments(query);

    const reservations = await Reservation.find(query)
      .sort({ date: 1, time: 1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: reservations.length,
      pagination,
      data: reservations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single reservation
// @route   GET /api/v1/reservations/:id
// @access  Private (Admin/Manager) or Customer who made the reservation
export const getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }

    // Only allow access to the reservation to admins or the customer who made it
    if (
      req.user && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager' && 
      reservation.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this reservation'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation
// @route   PUT /api/v1/reservations/:id
// @access  Private (Admin/Manager) or Customer who made the reservation
export const updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }

    // Only allow updating by admins or the customer who made it
    if (
      req.user && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager' && 
      reservation.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this reservation'
      });
    }

    // Don't allow customers to update reservations less than 24 hours away
    const reservationDate = new Date(reservation.date);
    const timeComponents = reservation.time.split(':');
    reservationDate.setHours(parseInt(timeComponents[0]), parseInt(timeComponents[1]), 0, 0);
    
    const now = new Date();
    const hoursDifference = (reservationDate - now) / (1000 * 60 * 60);

    if (
      hoursDifference < 24 && 
      req.user && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Reservations can only be modified at least 24 hours before the scheduled time'
      });
    }

    // Update reservation
    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/cancel reservation
// @route   DELETE /api/v1/reservations/:id
// @access  Private (Admin/Manager) or Customer who made the reservation
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }

    // Only allow cancellation by admins or the customer who made it
    if (
      req.user && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager' && 
      reservation.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this reservation'
      });
    }

    // Don't allow customers to cancel reservations less than 24 hours away
    const reservationDate = new Date(reservation.date);
    const timeComponents = reservation.time.split(':');
    reservationDate.setHours(parseInt(timeComponents[0]), parseInt(timeComponents[1]), 0, 0);
    
    const now = new Date();
    const hoursDifference = (reservationDate - now) / (1000 * 60 * 60);

    if (
      hoursDifference < 24 && 
      req.user && 
      req.user.role !== 'admin' && 
      req.user.role !== 'manager'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Reservations can only be cancelled at least 24 hours before the scheduled time'
      });
    }

    // Update status to cancelled instead of deleting
    reservation.status = 'canceled';
    await reservation.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check seat availability
// @route   GET /api/v1/reservations/availability
// @access  Public
export const checkAvailability = async (req, res, next) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Please provide date and time to check availability'
      });
    }

    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);
    
    // Find all reservations for that date & time
    const existingReservations = await Reservation.find({
      date: reservationDate,
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    }).select('seats');

    // Assuming you have fixed seats (like a restaurant floor plan)
    // This is a simplified example - adapt to your actual seating arrangement
    const allSeats = [
      'A1', 'A2', 'A3', 'A4', 'A5',
      'B1', 'B2', 'B3', 'B4', 'B5',
      'C1', 'C2', 'C3', 'C4', 'C5',
      'D1', 'D2', 'D3', 'D4', 'D5'
    ];
    
    // Get all reserved seats
    const reservedSeats = existingReservations.flatMap(res => res.seats);
    
    // Get available seats
    const availableSeats = allSeats.filter(seat => !reservedSeats.includes(seat));

    res.status(200).json({
      success: true,
      data: {
        availableSeats,
        reservedSeats
      }
    });
  } catch (error) {
    next(error);
  }
};