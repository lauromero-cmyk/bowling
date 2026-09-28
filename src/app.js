import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/task.routes.js";
import trainingRoutes from "./routes/training.routes.js";
import gameRoutes from "./routes/game.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import infoRoutes from "./routes/info.routes.js";

const app = express();

app.use(
  cors({
    // Acepta la app abierta desde el PC (localhost) o desde el celular en la misma red
    origin: true,
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BowlingPro API funcionando correctamente",
  });
});

app.use("/api", authRoutes);
app.use("/api", tasksRoutes);
app.use("/api", trainingRoutes);
app.use("/api", gameRoutes);
app.use("/api", lessonRoutes);
app.use("/api", challengeRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", infoRoutes);

export default app;
