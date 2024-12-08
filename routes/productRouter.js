import express from "express";
import { upload } from "../utils/uploadFileHandler.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  udpateProduct,
} from "../controllers/productController.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

// Create an Express router instance
const router = express.Router();

router.post(
  "/",
  protectedMiddleware,
  adminMiddleware,
  upload.array("image", 5),
  createProduct
);

router.get("/", getProducts);

router.get("/:productId", getProduct);

router.put(
  "/:productId",
  protectedMiddleware,
  adminMiddleware,
  upload.array("image", 5),
  udpateProduct
);

router.delete(
  "/:productId",
  protectedMiddleware,
  adminMiddleware,
  deleteProduct
);

export default router;
