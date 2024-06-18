import { Router } from "express";
import { newOrder,getMyOrders } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/newOrder").post(verifyJWT, newOrder);
router.route("/myOrders").get(verifyJWT, getMyOrders);

export default router;
