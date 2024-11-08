import { check } from "express-validator";

export const registerValidation = [
  check("username", "Username is required").not().isEmpty(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  check("email", "Please include a valid email").isEmail(),
];

export const loginValidation = [
  check("username", "Username is required").not().isEmpty(),
  check("password", "Password is required").exists(),
];
