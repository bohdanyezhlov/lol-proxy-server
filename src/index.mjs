import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import logger from "./utils/logger.mjs";
import authRouter from "./routes/auth.mjs";
import languagesRouter from "./routes/languages.mjs";
import championsRouter from "./routes/champions.mjs";
import auth from "./middlewares/auth.mjs";
import { swaggerUi, specs } from "./swaggerConfig.mjs";

dotenv.config({ path: ".env.local" });

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (e) {
    logger.error("MongoDB connection error:", e);
    process.exit(1);
  }
};

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/auth", authRouter);
app.use("/api", auth, languagesRouter);
app.use("/api", auth, championsRouter);

app.use((e, req, res, next) => {
  logger.error(e.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
