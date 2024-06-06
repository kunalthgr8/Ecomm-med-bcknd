import bcrypt from 'bcrypt';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, fullname, password } = req.body;

  // Check for empty fields
  if (!username || !email || !fullname || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user to the database
  const user = await User.create({ 
    username, 
    email, 
    fullname, 
    password: hashedPassword 
  });

  if (!user) {
    throw new ApiError(500, "User not created");
  }

  // Send response without password
  return res.status(201).json(
    new ApiResponse(201, {
      username: user.username,
      email: user.email,
      fullname: user.fullname,
    })
  );
});

export { registerUser };
