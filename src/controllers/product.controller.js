import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json(new ApiResponse(200, products));
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json(new ApiResponse(200, product));
});

const createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, description, image, brand, category, stock } = req.body;
  const userId = req.user._id;
  if(!name || !price || !description || !image || !category || !stock){
    throw new ApiError(400, "All fields are required");
  }

  const product = await Product.create({
    name,
    price,
    description,
    image,
    category,
    stock,
    user: userId,
  });
  if(!product){
    throw new ApiError(500, "Product not created");
  }

  res.status(201).json(new ApiResponse(201, product));
});

const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json(new ApiResponse(200, product));
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
   await Product.findByIdAndDelete(req.params.id);
  res.status(204).json(new ApiResponse(204, {}));
});

const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const userDetail = await User.findById(req.user);

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === userDetail._id.toString()
  );

  if (alreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === userDetail._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    const review = {
      name: userDetail.fullname,
      rating: Number(rating),
      comment,
      user: req.user,
    };
    product.reviews.push(review);
  }

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json(new ApiResponse(201, "Review added"));
});

const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, product.reviews));
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const review = product.reviews.find(
    (review) => review._id.toString() === req.params.reviewId
  );

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const removeIndex = product.reviews
    .map((review) => review._id.toString())
    .indexOf(req.params.reviewId);

  product.reviews.splice(removeIndex, 1);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(204).json(new ApiResponse(204, {}));
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
};
