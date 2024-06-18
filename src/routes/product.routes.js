import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  getProductCategories,
} from "../controllers/product.controller.js";
import { verifyJWT, isUserAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getProductById);
router.route("/products/reviews/:id").get(getProductReviews);
router.route("/categories").get(getProductCategories);
// Admin Routes
router.route("/createProduct").post(verifyJWT, isUserAdmin, createProduct);
router.route("/productUpdate/:id").put(verifyJWT, isUserAdmin, updateProduct);
router
  .route("/productDelete/:id")
  .delete(verifyJWT, isUserAdmin, deleteProduct);
router.route("/adminProducts").get(verifyJWT, isUserAdmin, getAdminProducts);
// User Review Routes
router.route("/productReview/review/:id").post(verifyJWT, createProductReview);
router
  .route("/productReviewDelete/:id/review/:reviewId")
  .delete(verifyJWT, deleteReview);
export default router;
