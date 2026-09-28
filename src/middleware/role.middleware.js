import User from "../models/user.model.js";

// Carga el usuario completo y verifica que tenga uno de los roles permitidos.
export const requireRole = (...roles) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        if (roles.length && !roles.includes(user.role)) {
            return res.status(403).json({ message: "No tienes permisos para esta acción" });
        }

        req.currentUser = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error al verificar permisos" });
    }
};
