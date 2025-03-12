import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Create sample users
const createUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await User.create({
      name: 'Restaurant Manager',
      email: 'manager@example.com',
      password: managerPassword,
      role: 'manager'
    });

    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staff = await User.create({
      name: 'Staff Member',
      email: 'staff@example.com',
      password: staffPassword,
      role: 'staff'
    });

    // Create regular customers
    const password = await bcrypt.hash('password123', 10);
    
    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: password,
      role: 'customer'
    });

    const customer2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: password,
      role: 'customer'
    });

    const customer3 = await User.create({
      name: 'Megafem World',
      email: 'megafemworld@example.com',
      password: password,
      role: 'customer'
    });

    console.log('Users seeded successfully!');
    return { admin, manager, staff, customers: [customer1, customer2, customer3] };
  } catch (error) {
    console.error(`Error seeding users: ${error.message}`);
    process.exit(1);
  }
};

export default createUsers;

// If run directly (node userSeeder.js)
if (require.main === module) {
  createUsers().then(() => {
    console.log('User seeder finished');
    mongoose.connection.close();
  });
}