import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";
import Game from "../models/game.model.js";
import TrainingSession from "../models/trainingSession.model.js";
import { computeStats } from "../libs/stats.js";

// Regla de negocio: el entrenador solo accede a jugadores de su grupo
const canCoach = (coach, player) =>
    coach.role === "admin" ||
    (coach.role === "entrenador" && player.role === "jugador" && coach.group === player.group);

// Lista de mensajes. Jugador: los suyos. Entrenador: ?player=<id> de su grupo.
export const getFeedback = async (req, res) => {
    const me = req.currentUser;
    let playerId = me._id;

    if (me.role !== "jugador") {
        const player = await User.findById(req.query.player).catch(() => null);
        if (!player || !canCoach(me, player)) {
            return res.status(403).json({ message: "Este jugador no pertenece a tu grupo" });
        }
        playerId = player._id;
    }

    const items = await Feedback.find({ player: playerId }).sort({ createdAt: -1 });

    // Al consultar, se marcan como leídos los mensajes que escribió la otra parte
    await Feedback.updateMany(
        { player: playerId, author: { $ne: me._id }, read: false },
        { read: true }
    );

    res.json(items);
};

export const createFeedback = async (req, res) => {
    const me = req.currentUser;
    const { text, player, kind } = req.body;

    if (!text || !String(text).trim()) {
        return res.status(400).json({ message: "El mensaje no puede estar vacío" });
    }

    let playerId = me._id;

    if (me.role !== "jugador") {
        const target = await User.findById(player).catch(() => null);
        if (!target || !canCoach(me, target)) {
            return res.status(403).json({ message: "Este jugador no pertenece a tu grupo" });
        }
        playerId = target._id;
    }

    const item = await Feedback.create({
        player: playerId,
        author: me._id,
        authorName: me.username,
        authorRole: me.role,
        kind: me.role === "jugador" ? "mensaje" : kind === "observacion" ? "observacion" : "mensaje",
        text
    });

    res.status(201).json(item);
};

// Jugadores del grupo del entrenador con sus estadísticas
export const getMyPlayers = async (req, res) => {
    const me = req.currentUser;
    const filter = me.role === "admin" ? { role: "jugador" } : { role: "jugador", group: me.group };
    const players = await User.find(filter);

    const rows = await Promise.all(
        players.map(async (p) => {
            const stats = computeStats(await Game.find({ user: p._id }));
            const trainings = await TrainingSession.countDocuments({ user: p._id, status: "completed" });
            const unread = await Feedback.countDocuments({ player: p._id, author: p._id, read: false });
            return {
                ...p.toPublic(),
                gamesPlayed: stats.gamesPlayed,
                average: stats.average,
                bestScore: stats.bestScore,
                strikePercentage: stats.strikePercentage,
                sparePercentage: stats.sparePercentage,
                trainings,
                unread
            };
        })
    );

    res.json(rows);
};
