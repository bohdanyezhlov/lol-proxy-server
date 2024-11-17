import { getChampionsData, getChampionDetails } from "../services/ddragon.mjs";
import logger from "../utils/logger.mjs";
import { DEFAULT_LANGUAGE } from "../constants.mjs";
import User from "../models/user.mjs";

export const handleGetChampions = async (req, res) => {
  const { lang = DEFAULT_LANGUAGE } = req.query;
  logger.info(`Fetching champions data with lang: ${lang}`);

  try {
    const data = await getChampionsData(lang);
    res.json(data);
  } catch (e) {
    handleError(e, res, lang);
  }
};

export const handleGetChampionDetails = async (req, res) => {
  const { id } = req.params;
  const { lang = DEFAULT_LANGUAGE } = req.query;

  try {
    const data = await getChampionDetails(id, lang);
    res.json(data);
  } catch (e) {
    handleError(e, res, lang, id);
  }
};

export const getMainChampion = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    const mainChampion = user.mainChampion;

    if (!mainChampion) {
      return res.status(404).json({ message: "No main champion set" });
    }

    logger.info(`User ${userId} main champion: ${mainChampion}`);
    res.status(200).json({ mainChampion });
  } catch (e) {
    logger.error(`Error fetching main champion: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const setMainChampion = async (req, res) => {
  const userId = req.user;
  const { championId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.mainChampion = championId;
    await user.save();

    logger.info(`User ${userId} set main champion to ${championId}`);
    res.status(200).json({ message: "Main champion set successfully" });
  } catch (e) {
    logger.error(`Error setting main champion: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeMainChampion = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    user.mainChampion = null;
    await user.save();

    logger.info(`User ${userId} removed main champion`);
    res.status(200).json({ message: "Main champion removed successfully" });
  } catch (e) {
    logger.error(`Error removing main champion: ${e.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const handleError = (e, res, lang, id = null) => {
  if (e.message.startsWith("Invalid language code")) {
    logger.warn(`Invalid language code: ${lang}`);
    res.status(400).json({ error: e.message });
  } else if (e.message.includes("not found")) {
    logger.warn(`Champion with ID ${id} not found`);
    res.status(404).json({ error: e.message });
  } else {
    if (id) {
      logger.error(
        `Error fetching champion details for ID ${id}: ${e.message}`
      );
    } else {
      logger.error(`Error fetching champions data: ${e.message}`);
    }
    res.status(500).json({ error: "Server error" });
  }
};
