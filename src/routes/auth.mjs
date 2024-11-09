import express from "express";

import {
  registerValidation,
  loginValidation,
} from "../validators/authValidators.mjs";
import { register, login } from "../controllers/authController.mjs";
import authRateLimiter from "../middlewares/rateLimiter.mjs";

const router = express.Router();

router.post("/register", authRateLimiter, registerValidation, register);
router.post("/login", authRateLimiter, loginValidation, login);

export default router;
