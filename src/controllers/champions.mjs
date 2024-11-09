import { getChampionsData, getChampionDetails } from "../services/ddragon.mjs";
import logger from "../utils/logger.mjs";
import { DEFAULT_LANGUAGE } from "../constants.mjs";

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
