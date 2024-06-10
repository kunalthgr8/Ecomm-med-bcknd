import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, fullname, phoneNumber, password } = req.body;

  // Check for empty fields
  if (!email || !fullname || !password || !phoneNumber) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Save user to the database
  const user = await User.create({
    email,
    fullname,
    phoneNumber,
    password,
  });

  if (!user) {
    throw new ApiError(500, "User not created");
  }

  // Send response without password
  return res.status(201).json(
    new ApiResponse(201, {
      email: user.email,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber,
    })
  );
});

const loginUser = asyncHandler(async (req, res, next) => {
  // Check for empty fields
  // Check if user exist
  // Check the password
  // access and refresh token generation
  // send cookies

  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    existingUser._id
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(200, {
        accessToken,
        refreshToken,
        user: loggedInUser,
        message: "user Logged in Successfully",
      })
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  user.refreshToken = undefined;
  console.log(user);
  await user.save({ validateBeforeSave: false });

  // await User.findByIdAndUpdate(
  //   req.user._id,
  //   {
  //     $set: { refreshToken: undefined },
  //   },
  //   {
  //     new: true,
  //   }
  // );
  const option = {
    httpOnly: true,
    secure: true,
  };
  console.log(req.cookies.accessToken, req.cookies.refreshToken);
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid referesh Token");
    }
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid referesh Token");
    }

    const { accessToken, newrefreshToken } = await genrateAccessAndRefreshToken(
      user._id
    );

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newrefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid referesh Token");
  }
});

//  Edit the user Details

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const editUserDetails = asyncHandler(async (req, res) => {
  const { email, fullname, phoneNumber, gender } = req.body;
  if (!email || !fullname || !phoneNumber || !gender) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const findUserByNewEmail = await User.findOne({ email });
  if (
    findUserByNewEmail &&
    findUserByNewEmail._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(400, "Email already exists");
  }

  user.email = email;
  user.fullname = fullname;
  user.phoneNumber = phoneNumber;
  user.gender = gender;
  const userUpdated = await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, userUpdated, "User updated successfully"));
});

const updateLocationDetails = asyncHandler(async (req, res) => {
  const { address, city, pincode, district } = req.body;
  if (!address || !city || !pincode || !district) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.address = address;
  user.city = city;
  user.pincode = pincode;
  user.district = district;
  const userUpdated = await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userUpdated,
        "User location details updated successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  editUserDetails,
  updateLocationDetails,
};
