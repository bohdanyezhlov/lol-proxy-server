import { Router } from "express";

import {
  getChampionsData,
  getChampionDetails,
} from "../services/ddragonService.mjs";
import logger from "../utils/logger.mjs";
import { DEFAULT_LANGUAGE } from "../constants.mjs";

const router = Router();

router.get("/champions", async (req, res) => {
  const { lang = DEFAULT_LANGUAGE } = req.query;
  logger.info(`Fetching champions data with lang: ${lang}`);

  try {
    const data = await getChampionsData(lang);

    res.json(data);
  } catch (err) {
    logger.error(`Error fetching champions data: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/champions/:id", async (req, res) => {
  const { id } = req.params;
  const { lang = DEFAULT_LANGUAGE } = req.query;

  try {
    const data = await getChampionDetails(id, lang);

    res.json(data);
  } catch (err) {
    logger.error(
      `Error fetching champion details for ID ${id}: ${err.message}`
    );
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
