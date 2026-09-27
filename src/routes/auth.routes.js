import { Router } from "express";

import {
    register,
    login
} from "../controllers/auth.controller.js";

import {
    registerSchema,
    loginSchema
} from "../schema/auth.schema.js";

import { validateSchema } from "../middleware/validate.middleware.js";

const router = Router();

router.post(
    "/register",
    registerSchema,
    validateSchema,
    register
);

router.post(
    "/login",
    loginSchema,
    validateSchema,
    login
);

export default router;