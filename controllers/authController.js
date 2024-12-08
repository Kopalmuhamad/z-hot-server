import User from "../models/userModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createResToken } from "../utils/createToken.js";

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // ! Validate required fields
  if (!name || !email || !phone || !password) {
    res.status(400).json({
      status: "error",
      message: "Please provide all required fields",
    });
    throw new Error("Please provide all required fields");
  }

  // * Check if this is the first user (admin)
  const isAdmin = (await User.countDocuments()) === 0 ? "true" : "false";
  const adminExists = (await User.countDocuments()) > 0;

  // ! Prevent multiple admin registrations
  if (adminExists) {
    res.status(400).json({
      status: "error",
      message: "Admin already exists",
    });
    throw new Error("Admin already exists");
  }

  // * Create new user
  const user = await User.create({
    email,
    name,
    phone,
    password,
    isAdmin,
  });

  // * Generate token and send response
  createResToken(user, 201, res);
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // ! Validate email and password
  if (!email || !password) {
    res.status(400);
    throw new Error("Both email and password are required");
  }

  // * Find user by email
  const user = await User.findOne({ email }).select("+password");

  // ! Check if user exists
  if (!user) {
    res.status(401);
    throw new Error("Invalid email");
  }

  // ! Validate password
  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid password");
  }

  // * Generate JWT and send response
  createResToken(user, 200, res);
});

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Public
 */
export const logoutUser = asyncHandler(async (req, res, next) => {
  // * Clear JWT cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  // * Send success response
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // * Find user by ID (excluding password)
  const user = await User.findById(req.user._id).select("-password");

  // ! Check if user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // * Send user data
  res.status(200).json({
    status: "success",
    data: user,
  });
});
