import Feedback from "../models/feedback.model.js";
import Game from "../models/game.model.js";
import { GLOSSARY, RULES, DAILY_TIPS } from "../libs/content.js";
import { computeStats } from "../libs/stats.js";
import { evaluateChallenges } from "./challenge.controller.js";

export const getGlossary = (req, res) => {
    res.json({ glossary: GLOSSARY, rules: RULES });
};

// Notificaciones dentro de la app: tip diario, retroalimentación sin leer y logros
export const getNotifications = async (req, res) => {
    const day = Math.floor(Date.now() / 86400000);
    const notifications = [
        { type: "tip", text: `Tip del día: ${DAILY_TIPS[day % DAILY_TIPS.length]}` }
    ];

    const unread = await Feedback.countDocuments({
        player: req.user.id,
        author: { $ne: req.user.id },
        read: false
    });

    if (unread > 0) {
        notifications.push({
            type: "feedback",
            text: `Tu entrenador te dejó ${unread} ${unread === 1 ? "mensaje nuevo" : "mensajes nuevos"}.`
        });
    }

    // Logros desbloqueados con la última partida registrada
    const games = await Game.find({ user: req.user.id }).sort({ date: 1 });
    if (games.length) {
        const before = evaluateChallenges(computeStats(games.slice(0, -1)));
        const after = evaluateChallenges(computeStats(games));
        after
            .filter((c, i) => c.completed && !before[i].completed)
            .forEach((c) =>
                notifications.push({ type: "achievement", text: `¡Logro desbloqueado! ${c.badge} ${c.title}` })
            );
    }

    res.json(notifications);
};
