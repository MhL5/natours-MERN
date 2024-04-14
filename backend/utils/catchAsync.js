/**
 * A higher-order function that wraps an asynchronous function with error handling.
 * this functions aims to replace the need of writing try catch blocks everywhere
 *
 * @param {Function} fn - The asynchronous function to be wrapped.
 * @returns {Function} - A middleware function that handles errors and passes control to the next middleware.
 *
 * @example
 * catchAsync(async (req, res, next) => {
 *   await doSomething();
 * });
 */

module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);
