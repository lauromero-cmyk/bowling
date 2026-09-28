import { Router } from "express";

import {
    register,
    login,
    getProfile,
    updateProfile
} from "../controllers/auth.controller.js";

import {
    registerSchema,
    loginSchema
} from "../schema/auth.schema.js";

import { validateSchema } from "../middleware/validate.middleware.js";
import { authRequired } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerSchema, validateSchema, register);
router.post("/login", loginSchema, validateSchema, login);
router.get("/profile", authRequired, getProfile);
router.put("/profile", authRequired, updateProfile);

export default router;
