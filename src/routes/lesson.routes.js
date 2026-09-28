import { Router } from "express";
import { authRequired } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
    getLessons,
    getLesson,
    submitQuiz,
    createLesson,
    updateLesson,
    deleteLesson
} from "../controllers/lesson.controller.js";

const router = Router();

router.get("/lessons", authRequired, getLessons);
router.get("/lessons/:id", authRequired, getLesson);
router.post("/lessons/:id/quiz", authRequired, submitQuiz);

// Solo el administrador crea, edita o elimina lecciones
router.post("/lessons", authRequired, requireRole("admin"), createLesson);
router.put("/lessons/:id", authRequired, requireRole("admin"), updateLesson);
router.delete("/lessons/:id", authRequired, requireRole("admin"), deleteLesson);

export default router;
