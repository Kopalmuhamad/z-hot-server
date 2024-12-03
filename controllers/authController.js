import User from "../models/userModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { createResToken } from "../utils/createToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400).json({
      status: "error",
      message: "Please provide all required fields",
    });
    throw new Error("Please provide all required fields");
  }

  const isAdmin = (await User.countDocuments()) === 0 ? "true" : "false";
  const adminExists = (await User.countDocuments()) > 0;

  if (adminExists) {
    res.status(400).json({
      status: "error",
      message: "Admin already exists",
    });
    throw new Error("Admin already exists");
  }

  const user = await User.create({
    email,
    name,
    phone,
    password,
    isAdmin,
  });

  createResToken(user, 201, res);
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Both email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email");
  }

  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid password");
  }

  // Generate JWT and send response
  createResToken(user, 200, res);
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});
