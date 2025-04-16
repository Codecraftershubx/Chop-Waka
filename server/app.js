import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './api/middlewares/error.js';
import routes from './api/routes/index.js';
import config from './config/index.js';
import logger from './utils/logger.js';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Logging middleware in development
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  logger.info(`Running node in ${config.NODE_ENV}`)
}

// Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'UP' });
// });

// Mount routes
app.use('/api/v1', routes);

// Error handler middleware (should be last)
app.use(errorHandler);

export default app;