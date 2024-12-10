import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/authRouter.js";
import articleRouter from "./routes/articleRouter.js";
import productRouter from "./routes/productRouter.js";
import imageSliderRouter from "./routes/imageSliderRouter.js";
import categoryRouter from "./routes/categoryRouter.js";

import { errorHandler, notFound } from "./middlewares/errorHandler.js";

// * Initialize Express application
const app = express();

// * Load environment variables from .env file
dotenv.config();

// * Set port number, default to 3000 if not specified in environment
const port = process.env.PORT || 3000;

// * Configure Cloudinary for image uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// * Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://z-hots.vercel.app",
      "https://z-hot-eta.vercel.app",
    ],
    credentials: true,
  })
); // Enable CORS for specified origins
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Set security HTTP headers
app.use(ExpressMongoSanitize()); // Sanitize data to prevent MongoDB Operator Injection

// * Route setup
app.use("/api/auth", authRouter);
app.use("/api/article", articleRouter);
app.use("/api/product", productRouter);
app.use("/api/imageSlider", imageSliderRouter);
app.use("/api/category", categoryRouter);

// * Error handling middleware
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Global error handler

// * Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// * Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
