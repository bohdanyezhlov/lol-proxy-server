import { Router } from "express";

import {
  getChampionsData,
  getChampionDetails,
} from "../services/ddragonService.mjs";
import logger from "../utils/logger.mjs";

const router = Router();

router.get("/champions", async (req, res) => {
  try {
    const lang = req.query.lang || "en_US";
    const data = await getChampionsData(lang);

    res.json(data);
  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ error: e.message });
  }
});

router.get("/champions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || "en_US";
    const data = await getChampionDetails(id, lang);

    res.json(data);
  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
