import express from "express";

import { registerValidation, loginValidation } from "../validations/auth.mjs";
import { register, login, verifyEmail } from "../controllers/auth.mjs";
import authRateLimiter from "../middlewares/rateLimiter.mjs";

const router = express.Router();

router.post("/register", authRateLimiter, registerValidation, register);
router.post("/login", authRateLimiter, loginValidation, login);
router.get("/verify-email", verifyEmail);

export default router;
