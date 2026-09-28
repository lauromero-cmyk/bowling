import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { getFeedback, createFeedback, getMyPlayers } from "../controllers/feedback.controller.js";

const router = Router();

router.get("/feedback", authRequired, requireRole(), getFeedback);
router.post("/feedback", authRequired, requireRole(), createFeedback);
router.get("/coach/players", authRequired, requireRole("entrenador", "admin"), getMyPlayers);

export default router;
