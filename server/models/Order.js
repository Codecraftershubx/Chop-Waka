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
        required: true
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

export default mongoose.model('Order', OrderSchema);