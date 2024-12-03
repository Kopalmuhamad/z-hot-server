/**
 * * Middleware to handle 404 Not Found errors.
 *
 * @function notFound
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const notFound = (req, res, next) => {
  // Create a new error with the requested URL
  const error = new Error(`Not Found - ${req.originalUrl}`);
  // Set the response status to 404
  res.status(404);
  // Pass the error to the next middleware
  next(error);
};

/**
 * * Global error handling middleware.
 *
 * @function errorHandler
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Determine the status code (use 500 if the status is 200)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Get the error message or use a default
  const message = err.message || "An error occurred";

  // Send the error response
  res.status(statusCode).json({
    message,
    // Include stack trace in non-production environments
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
