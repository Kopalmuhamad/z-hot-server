// * Import mongoose library for MongoDB interaction
import mongoose from "mongoose";

// * Destructure Schema from mongoose
const { Schema } = mongoose;

/**
 * Define the category schema
 * @typedef {Object} CategorySchema
 * @property {string} name - The name of the category (required)
 * @property {string} image - The URL of the category image (required)
 */
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

// * Create a mongoose model for the Category using the schema
const Category = mongoose.model("Category", categorySchema);

// * Export the Category model as the default export
export default Category;
