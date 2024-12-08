import Product from "../models/productModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Category from "../models/categoryModel.js";

const uploadImagesToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "product",
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
  });
  return Promise.all(uploadPromises);
};

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, tag } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please provide name");
  }

  if (!description) {
    res.status(400);
    throw new Error("Please provide description");
  }

  if (!category) {
    res.status(400);
    throw new Error("Please provide category");
  }

  if (!tag) {
    res.status(400);
    throw new Error("Please provide tag");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please provide image");
  }

  try {
    const imageUrls = await uploadImagesToCloudinary(req.files);

    const productData = {
      name,
      description,
      category,
      tag,
      image: imageUrls,
    };

    const newProduct = await Product.create(productData);

    await newProduct.populate({
      path: "category",
      select: "name",
    });

    res.status(201).json({
      success: true,
      message: "Product successfully created",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  const { category, page, limit, name } = req.query;

  const query = {};

  // Jika ada parameter category, kita akan memeriksa apakah itu ID atau nama kategori
  if (category) {
    // Cek apakah category adalah ID (misalnya, panjangnya 24 karakter seperti ObjectId MongoDB)
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category; // Jika category adalah ID, gunakan langsung
    } else {
      // Jika bukan ID, anggap sebagai nama kategori dan cari kategori berdasarkan nama
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" }, // Pencarian nama kategori case-insensitive
      });

      if (categoryDoc) {
        query.category = categoryDoc._id; // Menggunakan ID kategori untuk filter produk
      } else {
        return res.status(404).json({
          success: false,
          message: `Category with name '${category}' not found.`,
        });
      }
    }
  }

  // Filter berdasarkan nama produk jika ada query 'name'
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Filter produk dengan nama tertentu
  }

  let productsQuery = Product.find(query).populate({
    path: "category",
    select: "name", // Hanya mengambil nama kategori
  });

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  productsQuery = productsQuery.skip(skip).limit(limitNumber);

  const totalProduct = await Product.countDocuments(query);

  // Cek jika halaman yang diminta lebih besar dari total halaman yang tersedia
  if (pageNumber > Math.ceil(totalProduct / limitNumber)) {
    return res.status(404).json({
      success: false,
      message: "This page does not exist.",
    });
  }

  const products = await productsQuery;

  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found",
    });
  }

  const totalPages = Math.ceil(totalProduct / limitNumber);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
    pagination: {
      totalProduct,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
    },
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate({
    path: "category",
    select: "name",
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

export const udpateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description, category, tag } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = await uploadImagesToCloudinary(req.files);
    }

    let newCategory = [];

    if (category && category.length > 0) {
      newCategory = category.split(",");
    }

    let newTag = [];

    if (tag && tag.length > 0) {
      newTag = tag.split(",");
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = [...product.category, ...newCategory];
    product.tag = [...product.tag, ...newTag];
    product.image = [...product.image, ...newImageUrls];

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      success: false,
      error: error.message || "Unknown error occurred",
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.fingdByIdAndDelete(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
