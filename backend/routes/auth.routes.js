import express from "express";
import {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", (req, res, next) => {
  console.log("LOGIN ROUTE HIT");
  next();
}, loginUser);

// FORGOT PASSWORD
router.post("/forgot-password", forgetPassword);

// RESET PASSWORD
router.post("/reset-password/:token", resetPassword);

// logout
router.post("/logout", logoutUser);
export default router;