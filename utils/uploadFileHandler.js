import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

/**
 * Configure multer for in-memory file storage
 * This allows files to be stored in memory as buffers rather than on disk
 */
const storage = multer.memoryStorage();

/**
 * Create and export a multer instance with specific configuration
 * @type {multer.Multer}
 */
export const upload = multer({
  storage, // Use the in-memory storage
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

/**
 * Fungsi untuk meng-upload banyak gambar ke Cloudinary
 * @param {Array} files - Array file yang akan di-upload
 * @param {String} folder - Nama folder Cloudinary tempat gambar akan disimpan
 * @param {Array} transformation - Array transformasi gambar (optional)
 * @returns {Promise<Array>} - Array URL gambar yang berhasil di-upload
 */
export const uploadImagesToCloudinary = async (
  files,
  folder = "product",
  transformation = []
) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          allowed_formats: ["jpg", "png", "jpeg"],
          transformation,
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

/**
 * Fungsi untuk meng-upload satu gambar ke Cloudinary
 * @param {Object} file - File tunggal yang akan di-upload
 * @param {String} folder - Nama folder Cloudinary tempat gambar akan disimpan
 * @param {Array} transformation - Array transformasi gambar (optional)
 * @returns {Promise<String>} - URL gambar yang berhasil di-upload
 */
export const uploadSingleImageToCloudinary = async (
  file,
  folder = "product",
  transformation = []
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
