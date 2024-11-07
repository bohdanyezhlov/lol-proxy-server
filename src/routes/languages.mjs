import { Router } from "express";

import { getLanguages } from "../services/ddragonService.mjs";
import logger from "../utils/logger.mjs";

const router = Router();

router.get("/languages", async (_, res) => {
  try {
    const languages = await getLanguages();

    res.json(languages);
  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
