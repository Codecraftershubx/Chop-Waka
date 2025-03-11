import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import config from './index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      // These options are no longer needed in newer mongoose versions
      // but keeping them as comments for reference
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;