import { Router } from "express";

import {
  handleGetChampions,
  handleGetChampionDetails,
  getMainChampion,
  setMainChampion,
  removeMainChampion,
} from "../controllers/champions.mjs";

const router = Router();

router.get("/champions/main", getMainChampion);
router.post("/champions/main", setMainChampion);
router.delete("/champions/main", removeMainChampion);

router.get("/champions", handleGetChampions);
router.get("/champions/:id", handleGetChampionDetails);

export default router;
