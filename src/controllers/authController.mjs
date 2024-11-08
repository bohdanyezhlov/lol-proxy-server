import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/user.mjs";
import logger from "../utils/logger.mjs";

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      logger.warn(`Registration attempt with existing username: ${username}`);

      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });

    await newUser.save();

    logger.info(`User registered successfully: ${username}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    logger.error("Error during registration:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      logger.warn(`Login attempt with invalid username: ${username}`);

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(
        `Login attempt with invalid password for username: ${username}`
      );

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in successfully: ${username}`);
    res.json({ token });
  } catch (e) {
    logger.error("Error during login:", e);
    res.status(500).json({ message: "Server error" });
  }
};
