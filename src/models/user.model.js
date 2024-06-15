import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// username: {
//   type: String,
//   required: true,
//   unique: true,
//   trim: true,
//   lowercase: true,
//   index: true,
// },
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    role: {
      type: String,
      default: "user",
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    pincode: {
      type: String,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    orders: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// username: this.username,
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      phoneNumber: this.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
