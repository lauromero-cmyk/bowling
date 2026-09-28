import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const createToken = (user) =>
    jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

export const register = async (req, res) => {
    const { email, password, username, role, group } = req.body;

    try {
        // Solo se pueden registrar jugadores y entrenadores. El admin se crea por base de datos.
        const safeRole = role === "entrenador" ? "entrenador" : "jugador";

        const newUser = new User({
            email,
            password,
            username,
            role: safeRole,
            group: group || "general"
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            token: createToken(savedUser),
            user: savedUser.toPublic()
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
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: String(email).toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        res.json({
            token: createToken(user),
            user: user.toPublic()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user.toPublic());
};

export const updateProfile = async (req, res) => {
    try {
        // Solo se permiten estos campos. El nivel NO se edita a mano:
        // avanza al aprobar las lecciones (regla de negocio).
        const { username, style, group } = req.body;
        const changes = {};

        if (username) changes.username = username;
        if (style) changes.style = style;
        if (group) changes.group = group;

        const user = await User.findByIdAndUpdate(req.user.id, changes, {
            new: true,
            runValidators: true
        });

        res.json(user.toPublic());
    } catch (error) {
        res.status(400).json({ message: "No se pudo actualizar el perfil" });
    }
};
