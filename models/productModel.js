import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
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
  category: {
    type: String,
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hook untuk mengatur properti `new` berdasarkan `createdAt`
productSchema.pre("save", function (next) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Tanggal seminggu yang lalu
  if (this.createdAt > oneWeekAgo) {
    this.new = true;
  } else {
    this.new = false;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
