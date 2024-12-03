import { asyncHandler } from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * * Middleware to protect routes by verifying JWT token.
 *
 * @function protectedMiddleware
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} If no token is provided or token verification fails
 */
export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  // Extract JWT token from cookies
  let token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data and attach to request object
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      // Token verification failed
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    // No token provided
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/**
 * * Middleware to restrict access to admin users only.
 *
 * @function adminMiddleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const adminMiddleware = (req, res, next) => {
  if (req.user.isAdmin === true) {
    // User is an admin, allow access
    next();
  } else {
    // User is not an admin, deny access
    res.status(401).json({ message: "Not authorized as admin" });
  }
};
