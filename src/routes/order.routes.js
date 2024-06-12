import { Router } from "express";
import { newOrder } from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/newOrder").post(verifyJWT, newOrder);

export default router;
