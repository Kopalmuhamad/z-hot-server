import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Schema definition for the ImageSlider model
 */
const imageSliderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// * Create the ImageSlider model using the schema
const ImageSlider = mongoose.model("ImageSlider", imageSliderSchema);

export default ImageSlider;
