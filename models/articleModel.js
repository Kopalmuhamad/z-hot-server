import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", userSchema);

export default Article;
