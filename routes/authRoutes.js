import express from "express";

import { signup, login, admin, refresh, logout, forgotPassword, resetPassword } from "../controllers/authController.js";
import validateSignup from "../middleware/validateSignup.js";
import validateLogin from "../middleware/validateLogin.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validatePasswordField from "../middleware/validatePasswordField.js";
import validateEmailField from "../middleware/validateEmailField.js";
import loginLimiter from "../middleware/loginLimiter.js";
import signupLimiter from "../middleware/signupLimiter.js";

const router = express.Router();

router.post("/signup", signupLimiter, validateSignup, signup);

router.post("/login", validateLogin, loginLimiter, login);

router.get("/admin", authMiddleware, roleMiddleware("admin"), admin);

router.post("/refresh", refresh)

router.post("/logout", logout)

router.post("/forgot-password", validateEmailField, forgotPassword);

router.post("/reset-password/:token", validatePasswordField, resetPassword);


export default router;