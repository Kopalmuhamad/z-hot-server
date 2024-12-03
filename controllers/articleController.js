import { asyncHandler } from "../middlewares/asyncHandler.js";
import Article from "../models/articleModel.js";

export const createArticle = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please provide title and description");
  }

  const article = await Article.create({ title, description });

  res.status(201).json({
    success: true,
    data: article,
  });
});

export const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find();

  if (!articles) {
    res.status(404);
    throw new Error("No articles found");
  }

  res.status(200).json({
    success: true,
    data: articles,
  });
});

export const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findById(id);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  res.status(200).json({
    success: true,
    data: article,
  });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    res.status(400);
    throw new Error("Please provide title or description");
  }

  const article = await Article.findByIdAndUpdate(
    id,
    { title, description },
    { new: true, runValidators: true }
  );

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  res.status(200).json({
    success: true,
    message: "Article updated successfully",
    data: article,
  });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await Article.findByIdAndDelete(id);

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  res.status(200).json({
    success: true,
    message: "Article deleted successfully",
  });
});
