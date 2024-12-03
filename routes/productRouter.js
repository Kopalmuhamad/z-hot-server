import express from "express";

import { upload } from "../utils/uploadFileHandler.js";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";

import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  upload.array("image", 5),
  createProduct
);

router.get("/", getProducts);

router.get("/:id", getProduct);

router.put(
  "/:id",
  protectedMiddleware,
  adminMiddleware,
  upload.array("image", 5),
  updateProduct
);

router.delete("/:id", protectedMiddleware, adminMiddleware, deleteProduct);

export default router;
