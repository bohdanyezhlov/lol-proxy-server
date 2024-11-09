import {
  getChampionsData,
  getChampionDetails,
} from "../services/ddragonService.mjs";
import logger from "../utils/logger.mjs";
import { DEFAULT_LANGUAGE } from "../constants.mjs";

export const handleGetChampions = async (req, res) => {
  const { lang = DEFAULT_LANGUAGE } = req.query;
  logger.info(`Fetching champions data with lang: ${lang}`);

  try {
    const data = await getChampionsData(lang);
    res.json(data);
  } catch (err) {
    handleError(err, res, lang);
  }
};

export const handleGetChampionDetails = async (req, res) => {
  const { id } = req.params;
  const { lang = DEFAULT_LANGUAGE } = req.query;

  try {
    const data = await getChampionDetails(id, lang);
    res.json(data);
  } catch (err) {
    handleError(err, res, lang, id);
  }
};

const handleError = (err, res, lang, id = null) => {
  if (err.message.startsWith("Invalid language code")) {
    logger.warn(`Invalid language code: ${lang}`);
    res.status(400).json({ error: err.message });
  } else {
    if (id) {
      logger.error(
        `Error fetching champion details for ID ${id}: ${err.message}`
      );
    } else {
      logger.error(`Error fetching champions data: ${err.message}`);
    }

    res.status(500).json({ error: "Server error" });
  }
};
