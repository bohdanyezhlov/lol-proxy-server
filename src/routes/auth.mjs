import express from "express";

import {
  registerValidation,
  loginValidation,
} from "../validators/authValidators.mjs";
import { register, login } from "../controllers/authController.mjs";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router;
