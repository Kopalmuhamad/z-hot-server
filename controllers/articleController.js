import { asyncHandler } from "../middlewares/asyncHandler.js";
import Article from "../models/articleModel.js";
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
 * Creates a new article
 * @route POST /api/articles
 * @access Private
 */
export const createArticle = asyncHandler(async (req, res) => {
  const { title, description, tag } = req.body;

  // ! Validate required fields
  if (!title) {
    res.status(400);
    throw new Error("Please provide title");
  }

  if (!description) {
    res.status(400);
    throw new Error("Please provide description");
  }

  if (!tag) {
    res.status(400);
    throw new Error("Please provide tag");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please provide Image");
  }

  try {
    // * Upload image to Cloudinary
    const imageUrl = await uploadImagesToCloudinary([req.file]);

    // * Create new article in database
    const article = await Article.create({
      title,
      image: imageUrl,
      description,
      tag,
    });

    // * Send success response
    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    // ? Handle error
    res.status(500).json({ message: "Failed to create Article", error });
  }
});

/**
 * Retrieves all articles
 * @route GET /api/articles
 * @access Public
 */
export const getArticles = asyncHandler(async (req, res) => {
  // * Fetch all articles from database
  const articles = await Article.find();

  // ! Check if articles exist
  if (!articles) {
    res.status(404);
    throw new Error("No articles found");
  }

  // * Send success response with articles data
  res.status(200).json({
    success: true,
    data: articles,
  });
});

/**
 * Retrieves a single article by ID
 * @route GET /api/articles/:id
 * @access Public
 */
export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // * Fetch article from database
  const article = await Article.findById(id);

  // ! Check if article exists
  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  // * Send success response with article data
  res.status(200).json({
    success: true,
    data: article,
  });
});

/**
 * Updates an existing article
 * @route PUT /api/articles/:id
 * @access Private
 */
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, tag } = req.body;

  try {
    const article = await Article.findById(id);
    if (!title) {
      res.status(400);
      throw new Error("Please provide title");
    }

    if (!description) {
      res.status(400);
      throw new Error("Please provide description");
    }

    if (!tag) {
      res.status(400);
      throw new Error("Please provide tag");
    }

    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error("Please provide Image");
    }

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = await uploadImagesToCloudinary(req.files);
    }

    let newTag = [];

    if (tag) {
      newTag = tag.split(",");
    }

    article.title = title || article.title;
    article.description = description || article.description;
    article.tag = [...article.tag, ...newTag];
    article.image = [...article.image, ...newImageUrls];

    const updateArticle = await article.save();

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updateArticle,
    });
  } catch (error) {
    // ? Handle error
    res.status(500).json({ message: "Failed to update Article", error });
  }
});

/**
 * Deletes an article
 * @route DELETE /api/articles/:id
 * @access Private
 */
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // * Delete article from database
  const article = await Article.findByIdAndDelete(id);

  // ! Check if article exists
  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  // * Send success response
  res.status(200).json({
    success: true,
    message: "Article deleted successfully",
  });
});
