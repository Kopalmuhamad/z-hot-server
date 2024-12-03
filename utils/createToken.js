import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * * Generate a JSON Web Token (JWT) for a given user ID.
 *
 * @function signToken
 * @param {string} id - The user ID to be encoded in the token
 * @returns {string} A signed JWT
 */
export const signToken = (id) => {
  // Sign the token with the user ID, secret key, and expiration time
  return jwt.sign(
    { id }, // Payload: user ID
    process.env.JWT_SECRET, // Secret key from environment variables
    {
      expiresIn: "6d", // Token expiration time: 6 days
    }
  );
};

/**
 * * Create a response with a JWT token set as a cookie and send user data.
 *
 * @function createResToken
 * @param {Object} user - The user object for which the token is being created
 * @param {number} statusCode - The HTTP status code to be set in the response
 * @param {Object} res - The Express response object
 */
export const createResToken = (user, statusCode, res) => {
  // Generate JWT token for the user
  const token = signToken(user._id);

  // Set cookie options
  const cookieOption = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days expiration
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  };

  // Set the JWT as a cookie in the response
  res.cookie("jwt", token, cookieOption);

  // Remove password from user object before sending in response
  user.password = undefined;

  // Send JSON response with status and user data
  res.status(statusCode).json({
    status: "success",
    data: user,
  });
};
