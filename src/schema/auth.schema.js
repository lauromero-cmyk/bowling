import { body } from "express-validator";

export const registerSchema = [
    body("username")
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3 })
        .withMessage("El nombre de usuario debe tener mínimo 3 caracteres"),

    body("email")
        .notEmpty()
        .withMessage("El correo es obligatorio")
        .isEmail()
        .withMessage("El correo no es válido"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener mínimo 6 caracteres")
];


export const loginSchema = [
    body("email")
        .notEmpty()
        .withMessage("El correo es obligatorio")
        .isEmail()
        .withMessage("El correo no es válido"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
];