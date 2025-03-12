import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import connectDB from '../../config/db.js';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

// Log current date and time in required format
const currentDate = new Date();
const formattedDate = currentDate.toISOString().replace(/T/, ' ').substr(0, 19);
logger.info(`Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${formattedDate}`);
logger.info(`Current User's Login: megafemworld`);

const runSeeder = async () => {
  try {
    // First, check if MONGO_URI is defined
    if (!config.MONGO_URI) {
      logger.error('MONGO_URI is not defined in config. Check your environment variables.');
      process.exit(1);
    }

    // Connect to database
    await connectDB();
    
    logger.info('Connected to MongoDB');
    
    // Clear existing users
    logger.info('Clearing existing users...');
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

    logger.info('Users seeded successfully!');
    logger.info('Created users:');
    logger.info(`- Admin: ${admin.email}`);
    logger.info(`- Manager: ${manager.email}`);
    logger.info(`- Staff: ${staff.email}`);
    logger.info(`- Customers: ${customer1.email}, ${customer2.email}, ${customer3.email}`);
    
    // Close the connection
    logger.info('Disconnecting from MongoDB...');
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    
    return { admin, manager, staff, customers: [customer1, customer2, customer3] };
  } catch (error) {
    logger.error(`Error seeding users: ${error.message}`);
    // Close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeder()
    .then(() => {
      logger.info('Seeder executed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeder failed with error:', error);
      process.exit(1);
    });
}

export default runSeeder;