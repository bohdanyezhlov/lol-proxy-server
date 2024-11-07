import express from "express";

import languagesRouter from "./routes/languages.mjs";
import championsRouter from "./routes/champions.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api", languagesRouter);
app.use("/api", championsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
