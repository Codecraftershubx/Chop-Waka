import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../../models/MenuItem.js';
import connectDB from '../../config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Sample menu items based on your data
const menuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    basePrice: 14.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000',
    cuisine: 'Italian',
    availability: 'Available Now',
    rating: 4.8,
    isCustomizable: true,
    customizationOptions: {
      sizes: [
        { id: 'small', name: 'Small (10")', priceAdjustment: -3.00 },
        { id: 'medium', name: 'Medium (12")', priceAdjustment: 0 },
        { id: 'large', name: 'Large (14")', priceAdjustment: 4.00 }
      ],
      toppings: [
        { id: 1, name: 'Extra Cheese', price: 2.00 },
        { id: 2, name: 'Pepperoni', price: 2.50 },
        { id: 3, name: 'Mushrooms', price: 1.50 },
        { id: 4, name: 'Bell Peppers', price: 1.00 },
        { id: 5, name: 'Olives', price: 1.00 }
      ]
    }
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich, creamy tomato sauce with aromatic spices',
    basePrice: 16.50,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
    cuisine: 'Indian',
    availability: 'Available Now',
    rating: 4.7
  },
  {
    name: 'Vegetable Pad Thai',
    description: 'Stir-fried rice noodles with tofu, bean sprouts, peanuts, and lime',
    basePrice: 15.75,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000',
    cuisine: 'Thai',
    availability: 'Limited Quantity',
    rating: 4.5
  },
  {
    name: 'Double Cheeseburger',
    description: 'Two beef patties with cheddar cheese, lettuce, tomato, and special sauce',
    basePrice: 13.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
    cuisine: 'American',
    availability: 'Available Now',
    rating: 4.6
  },
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, onion, and our special sauce on a brioche bun.',
    basePrice: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1800',
    cuisine: 'American',
    availability: 'Available Now',
    rating: 4.8,
    isCustomizable: true,
    customizationOptions: {
      sizes: [
        { id: 'small', name: 'Small', priceAdjustment: -2.00 },
        { id: 'medium', name: 'Medium', priceAdjustment: 0 },
        { id: 'large', name: 'Large', priceAdjustment: 2.00 },
      ],
      toppings: [
        { id: 1, name: 'Extra Cheese', price: 1.50 },
        { id: 2, name: 'Bacon', price: 2.00 },
        { id: 3, name: 'Avocado', price: 1.75 },
        { id: 4, name: 'Fried Egg', price: 1.50 },
        { id: 5, name: 'Caramelized Onions', price: 1.00 },
        { id: 6, name: 'Mushrooms', price: 1.25 },
        { id: 7, name: 'Jalapeños', price: 0.75 },
        { id: 8, name: 'BBQ Sauce', price: 0.50 },
      ]
    }
  }
];

// Function to import data
const importData = async () => {
  try {
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);
    
    console.log('Menu items imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to delete data
const deleteData = async () => {
  try {
    await MenuItem.deleteMany();
    
    console.log('Menu items deleted successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Execute based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
}