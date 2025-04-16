import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import connectDB from './config/db.js';
import coonectRedis from './config/redis.js';

// Connect to MongoDB and Redis
connectDB();
coonectRedis();

const PORT = config.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});