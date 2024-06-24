import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "inr",
    metadata: {
      company: "Aoushadhi",
    },
  });
  res.status(200).json(new ApiResponse(200, paymentIntent.client_secret));
});

const sendStripeAPIKey = asyncHandler(async (req, res, next) => {
  res.status(200).json(new ApiResponse(200, process.env.STRIPE_PUBLISHABLE_KEY));
});


export { createPaymentIntent, sendStripeAPIKey };