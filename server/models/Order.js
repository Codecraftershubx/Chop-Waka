import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      menuItem: {
        type: mongoose.Schema.ObjectId,
        ref: 'MenuItem',
        required: false // No longer required to handle deleted menu items
      },
      menuItemData: {
        name: String,
        price: Number
        // Storing key menu item data directly in the order
      },
      customizations: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible customization structure
        default: {}
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  deliveryDetails: {
    method: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: false
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit', 'debit', 'online']
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions can not be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;