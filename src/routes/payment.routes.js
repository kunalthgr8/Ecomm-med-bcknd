import { Router } from "express";
import { createPaymentIntent,sendStripeAPIKey } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/process").post(verifyJWT, createPaymentIntent);
router.route("/key").get(verifyJWT, sendStripeAPIKey);

export default router;
