import mongoose from "mongoose";

// Destructure Schema from mongoose
const { Schema } = mongoose;

/**
 * Define the product schema
 * @typedef {Object} ProductSchema
 * @property {string} name - The name of the product (required)
 * @property {string} image - The URL of the product image
 * @property {Array} category - Array of category IDs (references to categories)
 * @property {string} description - A description of the product (required)
 * @property {boolean} hot - If the product is hot (optional)
 * @property {boolean} new - If the product is new (optional)
 * @property {Array} tag - Array of tags associated with the product (optional)
 * @property {Date} createdAt - Date the product was created (auto generated)
 * @property {Date} updatedAt - Date the product was last updated (auto generated)
 */
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    hot: {
      type: Boolean,
      default: false,
    },
    new: {
      type: Boolean,
      default: false,
    },
    tag: [
      {
        type: String,
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to set the 'new' property based on the creation date.
 * @function
 * @name preSaveHook
 * @memberof ProductSchema
 */
productSchema.pre("save", function (next) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Tanggal seminggu yang lalu
  if (this.createdAt > oneWeekAgo) {
    this.new = true;
  } else {
    this.new = false;
  }
  next();
});

// Create mongoose model for Product
const Product = mongoose.model("Product", productSchema);

// Export Product model
export default Product;
