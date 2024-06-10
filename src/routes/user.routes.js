import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  editUserDetails,
  updateLocationDetails,
} from "../controllers/user.controller.js";
import { verifyJWT, logoutUserPerma } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured route
router.route("/logout").post(logoutUserPerma, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/changePassword").post(verifyJWT, changeCurrentPassword);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/updateUserDetails").put(verifyJWT, editUserDetails);
router.route("/updateLocationDetails").put(verifyJWT, updateLocationDetails);

export default router;
