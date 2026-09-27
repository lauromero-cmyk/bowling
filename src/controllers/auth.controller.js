import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const newUser = new User({
            email,
            password,
            username
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });

    } catch (error) {
        console.log("ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "El correo ya está registrado"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Datos inválidos",
                errors: error.errors
            });
        }

        return res.status(500).json({
            message: "Error al registrar usuario"
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send("Usuario no encontrado");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).send("Contraseña incorrecta");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
};