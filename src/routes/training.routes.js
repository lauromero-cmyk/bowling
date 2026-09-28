import { Router } from "express";

import {
  startTraining,
  addAttempt,
  finishTraining,
  getTrainingHistory,
  getTrainingStats
} from "../controllers/training.controller.js";

import { authRequired } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/training/start",
  authRequired,
  startTraining
);

router.post(
  "/training/:id/attempt",
  authRequired,
  addAttempt
);

router.post(
  "/training/:id/finish",
  authRequired,
  finishTraining
);

router.get(
  "/training/history",
  authRequired,
  getTrainingHistory
);

router.get(
  "/training/stats",
  authRequired,
  getTrainingStats
);

export default router;