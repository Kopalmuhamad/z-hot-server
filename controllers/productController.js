import { asyncHandler } from "../middlewares/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Product from "../models/productModel.js";

const uploadImagesToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "z-hot",
          allowed_formats: ["jpg", "png", "jpeg"],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  });
  return Promise.all(uploadPromises);
};

export const createProduct = asyncHandler(async (req, res) => {
  console.log("Request Body:", req.body); // Debug data yang dikirim dari body
  console.log("Uploaded Files:", req.files); // Debug file yang diterima

  const { name, category, description } = req.body;

  if (!name || !req.files || !category || !description) {
    res.status(400);
    throw new Error("Please provide name, image, category, and description");
  }

  try {
    const imageUrls = await uploadImagesToCloudinary(req.files);

    const product = await Product.create({
      name,
      image: imageUrls,
      category,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  products.forEach((product) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    product.new = product.createdAt > oneWeekAgo;
  });

  if (!products) {
    res.status(404);
    throw new Error("Products not found");
  }

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Perbarui status `new` saat fetching
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  product.new = product.createdAt > oneWeekAgo;

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = await uploadImagesToCloudinary(req.files);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = [...product.image, ...newImageUrls];

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message || "Unknown error occurred",
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
