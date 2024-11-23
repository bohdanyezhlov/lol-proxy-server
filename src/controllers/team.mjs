import User from "../models/user.mjs";
import logger from "../utils/logger.mjs";

export const getTeam = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const team = user.team;

    if (!team) {
      return res.status(404).json({ message: "No team found" });
    }

    logger.info(`User ${userId} team: ${JSON.stringify(team)}`);
    res.status(200).json({ team });
  } catch (e) {
    logger.error(`Error fetching team: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTeam = async (req, res) => {
  const userId = req.user;
  const { top, jungle, mid, adc, support } = req.body;

  if (!top || !jungle || !mid || !adc || !support) {
    return res.status(400).json({ message: "All roles must be filled" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.team = { top, jungle, mid, adc, support };
    await user.save();

    logger.info(`User ${userId} created a new team`);
    res.status(201).json({ message: "Team created successfully" });
  } catch (e) {
    logger.error(`Error creating team: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTeam = async (req, res) => {
  const userId = req.user;
  const { top, jungle, mid, adc, support } = req.body;

  if (!top || !jungle || !mid || !adc || !support) {
    return res.status(400).json({ message: "All roles must be filled" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.team = { top, jungle, mid, adc, support };
    await user.save();

    logger.info(`User ${userId} updated their team`);
    res.status(200).json({ message: "Team updated successfully" });
  } catch (e) {
    logger.error(`Error updating team: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTeam = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.team = null;
    await user.save();

    logger.info(`User ${userId} deleted their team`);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (e) {
    logger.error(`Error deleting team: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
