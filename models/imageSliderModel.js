import mongoose from "mongoose";

const { Schema } = mongoose;

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

const ImageSlider = mongoose.model("ImageSlider", imageSliderSchema);

export default ImageSlider;
