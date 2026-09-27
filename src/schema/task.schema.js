import { body } from "express-validator";

export const createTaskSchema = [
    body("title")
        .notEmpty()
        .withMessage("El título es obligatorio")
        .isLength({ min: 3 })
        .withMessage("El título debe tener mínimo 3 caracteres"),

    body("description")
        .notEmpty()
        .withMessage("La descripción es obligatoria")
];


export const updateTaskSchema = [
    body("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("El título debe tener mínimo 3 caracteres"),

    body("description")
        .optional()
        .notEmpty()
        .withMessage("La descripción no puede estar vacía")
];