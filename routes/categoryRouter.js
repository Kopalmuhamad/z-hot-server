import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

// * Create an Express router instance
const router = express.Router();

/**
 * Route to create a new category
 * @route POST /api/categories/create
 * @access Private (Protected & Admin only)
 */
router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  createCategory
);

/**
 * Route to get all categories
 * @route GET /api/categories
 * @access Public
 */
router.get("/", getCategories);

/**
 * Route to get a specific category by ID
 * @route GET /api/categories/:categoryId
 * @access Public
 */
router.get("/:categoryId", getCategory);

/**
 * Route to update a specific category
 * @route PUT /api/categories/:categoryId
 * @access Private (Protected & Admin only)
 */
router.put(
  "/:categoryId",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateCategory
);

/**
 * Route to delete a specific category
 * @route DELETE /api/categories/:categoryId
 * @access Private (Protected & Admin only)
 */
router.delete(
  "/:categoryId",
  protectedMiddleware,
  adminMiddleware,
  deleteCategory
);

export default router;
