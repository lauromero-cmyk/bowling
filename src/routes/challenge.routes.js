import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import { getChallenges, getLeaderboard } from "../controllers/challenge.controller.js";

const router = Router();

router.get("/challenges", authRequired, getChallenges);
router.get("/leaderboard", authRequired, getLeaderboard);

export default router;
