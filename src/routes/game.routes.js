import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import {
    createGame,
    getGames,
    getGame,
    deleteGame,
    getGameStats
} from "../controllers/game.controller.js";

const router = Router();

router.get("/games/stats", authRequired, getGameStats);
router.get("/games", authRequired, getGames);
router.get("/games/:id", authRequired, getGame);
router.post("/games", authRequired, createGame);
router.delete("/games/:id", authRequired, deleteGame);

export default router;
