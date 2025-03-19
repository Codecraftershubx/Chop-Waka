import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  // Basic reservation details
  date: {
    type: Date,
    required: [true, 'Please provide a reservation date'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Reservation date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Please provide a reservation time'],
    validate: {
      validator: function(value) {
        // Validate time format HH:MM AM/PM or 24hr format
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s?(AM|PM))?$/.test(value);
      },
      message: 'Time format should be valid (e.g. "7:30 PM" or "19:30")'
    }
  },
  partySize: {
    type: Number,
    required: [true, 'Please specify how many people'],
    min: [1, 'Party size must be at least 1'],
    max: [20, 'For larger parties, please contact us directly']
  },
  
  // Customer information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  
  // Additional information
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  
  // Selected seats
  seats: [{
    type: String,
    required: [true, 'At least one seat must be selected']
  }],
  
  // Reservation status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'completed', 'no-show'],
    default: 'pending'
  },
  
  // Optional: reference to user if authentication is implemented
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // System fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
ReservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

export default Reservation;