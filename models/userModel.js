import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const { Schema } = mongoose;

// * Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator: [validator.isEmail, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// * Hash password before saving
userSchema.pre("save", async function (next) {
  // ! Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }

  // * Generate a salt and hash the password
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// * Method to compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// * Create and export the User model
const User = mongoose.model("User", userSchema);

export default User;
