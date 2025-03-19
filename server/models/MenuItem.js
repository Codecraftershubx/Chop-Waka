import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Please provide base price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  cuisine: {
    type: String,
    required: [true, 'Please specify cuisine type'],
    enum: ['Yoruba', 'Igbo', 'Hausa', 'Edo', 'American']
  },
  availability: {
    type: String,
    required: [true, 'Please specify availability'],
    enum: ['Available Now', 'Limited Quantity', 'Pre-Order', 'Sold Out'],
    default: 'Available Now'
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot be above 5'],
    default: 0
  },
  // reviews: {
  //   count: {
  //     type: Number,
  //     default: 0
  //   },
  //   list: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Review'
  //   }]
  // },
  isCustomizable: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    sizes: [{
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      priceAdjustment: {
        type: Number,
        default: 0
      }
    }],
    toppings: [{
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }]
  },
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
MenuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

export default MenuItem;