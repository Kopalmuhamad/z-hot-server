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

import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://excelent-car.vercel.app"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());
app.use(ExpressMongoSanitize());

app.use("/api/auth", authRouter);
app.use("/api/article", articleRouter);
app.use("/api/product", productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
