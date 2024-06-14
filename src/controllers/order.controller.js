import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const newOrder = asyncHandler(async (req, res, next) => {
  //   const {
  // orderItems,
  // paymentInfo,
  // itemsPrice,
  // taxPrice,
  // shippingPrice,
  // totalPrice,
  //   } = req.body;
  const {
    orderItems,
    paymentInfo,
    paidAt,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
  } = req.body;
  console.log("Order Items:", orderItems);
  console.log("Payment Info:", paymentInfo);
  console.log("Paid At:", paidAt);
  console.log("Items Price:", itemsPrice);
  console.log("Tax Price:", taxPrice);
  console.log("Shipping Price:", shippingPrice);
  console.log("Total Price:", totalPrice);
  console.log("Order Status:", orderStatus);
  console.log("User:", req.user);
  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "No order items");
  }
  const order = await Order.create({
    orderItems,
    paymentInfo,
    paidAt: Date.now(),
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
    user: req.user._id,
  });
  if (!order) {
    throw new ApiError(400, "Invalid order data");
  }
  res.status(201).json(new ApiResponse(201, order));
});
