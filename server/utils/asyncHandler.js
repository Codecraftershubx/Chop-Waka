import logger from './logger.js';
// Improved async handler to direectly send error responses
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res,next)).catch((err) => {
    logger.error(err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  });
};

export default asyncHandler;