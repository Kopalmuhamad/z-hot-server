import express from "express";

import { protectedMiddleware } from "../middlewares/authMiddleware.js";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";

// * Create an Express router instance
const router = express.Router();

/**
 * Route to register a new user
 * @route POST /api/auth/register
 * @access Public
 */
router.post("/register", registerUser);

/**
 * Route to login a user
 * @route POST /api/auth/login
 * @access Public
 */
router.post("/login", loginUser);

/**
 * Route to logout a user
 * @route GET /api/auth/logout
 * @access Public
 */
router.get("/logout", logoutUser);

/**
 * Route to get the current user's information
 * @route GET /api/auth/me
 * @access Private
 */
router.get("/me", protectedMiddleware, getCurrentUser);

export default router;
