import express from "express";

import { protectedMiddleware } from "../middlewares/authMiddleware.js";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/me", protectedMiddleware, getCurrentUser);

export default router;
