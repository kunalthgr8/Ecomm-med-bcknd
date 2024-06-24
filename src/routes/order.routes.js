import { Router } from "express";
import {
  newOrder,
  getMyOrders,
  payment,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/newOrder").post(verifyJWT, newOrder);
router.route("/myOrders").get(verifyJWT, getMyOrders);
router.route("/payment").post(verifyJWT, payment);
export default router;
