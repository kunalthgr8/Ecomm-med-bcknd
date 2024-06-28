import { ApiError } from "../utils/ApiError.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle known ApiError
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
    });
  } else {
    // Handle unknown errors
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      errors: [],
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
};

export { errorHandler };
