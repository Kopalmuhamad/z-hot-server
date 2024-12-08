import ImageSlider from "../models/imageSliderModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * Uploads images to Cloudinary
 * @param {Array} files - Array of file objects to upload
 * @returns {Promise<string>} Secure URL of the uploaded image
 */
const uploadImagesToCloudinary = async (files) => {
  const file = files[0];
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "category",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ fetch_format: "webp" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

/**
 * Creates a new image slider
 * @route POST /api/image-slider
 * @access Private (Admin only)
 */
export const createImageSlider = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // ! Validate required fields
  if (!name) {
    res.status(400);
    throw new Error("Please provide name");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please provide image");
  }

  try {
    // * Upload images to Cloudinary
    const imageUrl = await uploadImagesToCloudinary([req.file]);

    // * Create new image slider in database
    const imageSlider = await ImageSlider.create({
      name,
      image: imageUrl,
    });

    // * Send success response
    res.status(201).json({
      success: true,
      message: "Image Added successfully",
      data: imageSlider,
    });
  } catch (error) {
    // ? Handle error
    res.status(500).json({ message: "Failed to Add Image", error });
  }
});

/**
 * Retrieves all image sliders
 * @route GET /api/image-slider
 * @access Public
 */
export const getImagesSlider = asyncHandler(async (req, res) => {
  // * Fetch all image sliders from database
  const images = await ImageSlider.find();

  // ! Check if images exist
  if (!images) {
    res.status(404);
    throw new Error("Images not found");
  }

  // * Send success response with images data
  res.status(200).json({
    success: true,
    message: "Images fetched successfully",
    data: images,
  });
});
