import User from "../models/user.mjs";
import logger from "../utils/logger.mjs";

export const listUsers = async (req, res) => {
  logger.info("Fetching all users");

  try {
    const users = await User.find().select(
      "email is_email_verified main_champion team"
    );
    res.status(200).json(users);
  } catch (e) {
    logger.error(`Error fetching users: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
