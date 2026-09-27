import { Router } from "express";

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

import { authRequired } from "../middleware/auth.middleware.js";

import {
    createTaskSchema,
    updateTaskSchema
} from "../schema/task.schema.js";

import { validateSchema } from "../middleware/validate.middleware.js";

const router = Router();

router.get(
    "/task",
    authRequired,
    getTasks
);

router.get(
    "/task/:id",
    authRequired,
    getTask
);

router.post(
    "/task",
    authRequired,
    createTaskSchema,
    validateSchema,
    createTask
);

router.put(
    "/task/:id",
    authRequired,
    updateTaskSchema,
    validateSchema,
    updateTask
);

router.delete(
    "/task/:id",
    authRequired,
    deleteTask
);

export default router;