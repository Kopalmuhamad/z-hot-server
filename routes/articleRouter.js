import express from "express";
import { upload } from "../utils/uploadFileHandler.js";

import {
  adminMiddleware,
  protectedMiddleware,
} from "../middlewares/authMiddleware.js";

import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
} from "../controllers/articleController.js";

// * Create an Express router instance
const router = express.Router();

/**
 * Route to create a new article
 * @route POST /api/articles/create
 * @access Private (Admin only)
 */
router.post(
  "/create",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  createArticle
);

/**
 * Route to get all articles
 * @route GET /api/articles
 * @access Public
 */
router.get("/", getArticles);

/**
 * Route to get a specific article by ID
 * @route GET /api/articles/:id
 * @access Public
 */
router.get("/:id", getArticle);

/**
 * Route to update an existing article
 * @route PUT /api/articles/:id
 * @access Private (Admin only)
 */
router.put("/:id", protectedMiddleware, adminMiddleware, updateArticle);

/**
 * Route to delete an article
 * @route DELETE /api/articles/:id
 * @access Private (Admin only)
 */
router.delete("/:id", protectedMiddleware, adminMiddleware, deleteArticle);

export default router;
