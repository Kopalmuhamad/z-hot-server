import { asyncHandler } from "../middlewares/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Category from "../models/categoryModel.js";

/**
 * Uploads images to Cloudinary
 * @param {Array} files - Array of file objects to upload
 * @returns {Promise<Array>} Array of secure URLs of uploaded images
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
 * Creates a new category
 * @route POST /api/categories/create
 * @access Private (Admin only)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // ! Validate required fields
  if (!name) {
    res
      .status(400)
      .json({ success: false, message: "Nama kategori diperlukan" });
    throw new Error("Nama kategori diperlukan");
  }

  if (!req.file) {
    // ! Check for single file (image)
    res.status(400).json({ success: false, message: "Gambar diperlukan" });
    throw new Error("Gambar diperlukan");
  }

  try {
    // * Upload image to Cloudinary and get URL
    const imageUrl = await uploadImagesToCloudinary([req.file]); // We only take one file

    // * Save new category with image URL
    const category = await Category.create({ name, image: imageUrl });

    // * Send success response
    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: category,
    });
  } catch (error) {
    // ? Handle error
    res.status(500).json({ message: "Gagal membuat kategori", error });
  }
});

/**
 * Retrieves all categories
 * @route GET /api/categories
 * @access Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (!categories || categories.length === 0) {
    res.status(404);
    throw new Error("No categories found");
  }

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

/**
 * Retrieves a single category by ID
 * @route GET /api/categories/:categoryId
 * @access Public
 */
export const getCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});

/**
 * Updates an existing category
 * @route PUT /api/categories/:categoryId
 * @access Private (Admin only)
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  // ! Validate required fields
  if (!name) {
    res.status(400).json({ success: false, message: "Name is required" });
    throw new Error("Name is required");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400).json({ success: false, message: "Image is required" });
    throw new Error("Image is required");
  }

  try {
    // * Upload new images to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(req.files);

    // * Update category in the database
    const category = await Category.findByIdAndUpdate(categoryId, {
      name,
      image: imageUrls,
    });

    // ! Check if category exists
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    // * Send success response
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    // ? Handle errors
    res.status(500).json({ message: "Failed to update category", error });
  }
});

/**
 * Deletes a category
 * @route DELETE /api/categories/:categoryId
 * @access Private (Admin only)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
