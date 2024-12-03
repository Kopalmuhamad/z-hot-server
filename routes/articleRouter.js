import express from "express";

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

const router = express.Router();

router.post("/create", protectedMiddleware, adminMiddleware, createArticle);

router.get("/", getArticles);

router.get("/:id", getArticle);

router.put("/:id", protectedMiddleware, adminMiddleware, updateArticle);

router.delete("/:id", protectedMiddleware, adminMiddleware, deleteArticle);

export default router;
