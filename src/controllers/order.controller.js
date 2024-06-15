import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const newOrder = asyncHandler(async (req, res, next) => {
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

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "No order items");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ownerIds = new Set();

    for (const item of orderItems) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new ApiError(400, "Product not found");
      }

      if (product.stock < item.qty) {
        throw new ApiError(400, "Product out of stock");
      }

      product.stock -= item.qty;
      product.customers += 1;
      await product.save({ session });

      ownerIds.add(product.user.toString());
    }

    for (const ownerId of ownerIds) {
      const user = await User.findById(ownerId).session(session);
      if (user) {
        user.orders += 1;
        await user.save({ session });
      }
    }

    const order = await Order.create(
      [
        {
          orderItems,
          paymentInfo,
          paidAt: Date.now(),
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          orderStatus,
          user: req.user._id,
        },
      ],
      { session }
    );

    if (!order) {
      throw new ApiError(400, "Invalid order data");
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(new ApiResponse(201, order));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});
