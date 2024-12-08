import express from "express";
import {
  createImageSlider,
  getImagesSlider,
} from "../controllers/imageSlicerController.js";
import {
  adminMiddleware,
  protectedMiddleware,
} from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

// * Create an Express router instance
const router = express.Router();

/**
 * Route to create a new image slider
 * @route POST /api/image-slider
 * @access Private (Admin only)
 */
router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  upload.single("image"),
  createImageSlider
);

/**
 * Route to get all image sliders
 * @route GET /api/image-slider
 * @access Public
 */
router.get("/", getImagesSlider);

/**
 * Route to get a specific image by ID
 * @route GET /api/image-slider/:imageId
 * @access Public
 */
router.get("/:imageId", (req, res) => res.send(req.params.imageId));

export default router;
