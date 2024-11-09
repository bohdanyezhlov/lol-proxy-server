import { Router } from "express";

import {
  handleGetChampions,
  handleGetChampionDetails,
} from "../controllers/champions.mjs";

const router = Router();

router.get("/champions", handleGetChampions);
router.get("/champions/:id", handleGetChampionDetails);

export default router;
