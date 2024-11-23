import express from "express";
import { listUsers } from "../controllers/user.mjs";

const router = express.Router();

router.get("/users", listUsers);

export default router;
