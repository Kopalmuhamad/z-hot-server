/**
 * * Wraps an asynchronous Express route handler to automatically catch and forward errors.
 *
 * @function asyncHandler
 * @param {Function} fn - The asynchronous route handler function to wrap
 * @returns {Function} A new function that wraps the original handler with error catching
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
