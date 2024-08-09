import mongoose from "mongoose";
import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    return next(new ApiError(400, "No order items"));
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
      product.totalProfit += item.qty * item.price; // Calculate and update total profit
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
    res.status(201).json(new ApiResponse(201, order));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

export const getMyOrders = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
});

export const payment  = asyncHandler(async (req, res, next) => {
    
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const {
    orderItems,
  } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: parseInt(item.price * item.qty+(item.price * item.qty)*0.3 + 10), // Calculate total price of particular item adding tax and shipping
        },
        quantity: item.qty,
      })),

      mode: "payment",
      success_url: "https://ecomm-med.vercel.app/",
      cancel_url: "https://ecomm-med.vercel.app/stepper",
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);