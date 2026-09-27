import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/task.routes.js";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());



app.get("/", (req, res) => {
  res.json({
    message: "BowlingPro API funcionando correctamente",
  });
});



app.use("/api", authRoutes);
app.use("/api", tasksRoutes);


export default app;