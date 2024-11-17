import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user.mjs";
import logger from "../utils/logger.mjs";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.mjs";

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res
        .status(400)
        .json({ message: `User with the email ${email} already exists` });
    }

    const newUser = new User({ email, password });
    const token = newUser.generateEmailVerificationToken();
    await newUser.save();

    await sendVerificationEmail(newUser, token);

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    logger.error("Error during registration:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      email_verification_token: token,
      email_verification_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.is_email_verified = true;
    user.email_verification_token = undefined;
    user.email_verification_expires = undefined;
    await user.save();

    logger.info(`User email verified successfully: ${user.email}`);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (e) {
    logger.error("Error during email verification:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Login attempt with invalid email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      logger.warn(`Login attempt with invalid password for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in successfully: ${email}`);
    res.json({ token });
  } catch (e) {
    logger.error("Error during login:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const token = user.generatePasswordResetToken();
    await user.save();

    await sendPasswordResetEmail(user, token);

    logger.info(`Password reset email sent to: ${email}`);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (e) {
    logger.error(`Error in requestPasswordReset: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, new_password } = req.body;

  try {
    const user = await User.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = new_password;
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
