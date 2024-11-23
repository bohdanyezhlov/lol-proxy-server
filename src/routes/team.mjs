import express from "express";

import {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeam,
} from "../controllers/team.mjs";

const router = express.Router();

router.get("/team", getTeam);
router.post("/team", createTeam);
router.put("/team", updateTeam);
router.delete("/team", deleteTeam);

export default router;
