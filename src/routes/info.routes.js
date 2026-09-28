import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import { getGlossary, getNotifications } from "../controllers/info.controller.js";

const router = Router();

router.get("/glossary", getGlossary);
router.get("/notifications", authRequired, getNotifications);

export default router;
