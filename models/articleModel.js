import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Schema definition for the Article model
 */
const userSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  tag: [
    {
      type: String,
      required: true,
    },
  ],
});

// * Create the Article model using the schema
const Article = mongoose.model("Article", userSchema);

export default Article;
