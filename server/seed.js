import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// The main app can already access the environment variables, 
// so we'll leverage that instead of trying to load them again

const seedUsers = async () => {
  try {
    console.log('Starting user seeder...');
    console.log('Current Date and Time:', new Date().toISOString().replace('T', ' ').substr(0, 19));
    console.log('User: megafemworld');
    
    // Clear existing users
    console.log('Clearing existing users...');
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
    console.log(`Created ${await User.countDocuments()} users`);
    
    return { admin, manager, staff, customers: [customer1, customer2, customer3] };
  } catch (error) {
    console.error(`Error seeding users: ${error.message}`);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // We'll assume the MongoDB connection is already established
    // by importing and using your standard connection logic
    // but we won't close it at the end of each seeder
    
    console.log('Starting database seeding...');
    
    // Run user seeder
    await seedUsers();
    
    // Add other seeders here
    // await seedCategories();
    // await seedMenuItems();
    
    console.log('All seeding completed successfully!');
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

// Import your normal database connection setup
import connectDB from './config/db.js';

// Run the seeder if the file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Connect to the database first
  connectDB()
    .then(() => seedDatabase())
    .then(() => {
      console.log('Seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedUsers, seedDatabase };