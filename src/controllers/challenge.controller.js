import Game from "../models/game.model.js";
import User from "../models/user.model.js";
import { CHALLENGES } from "../libs/content.js";
import { computeStats } from "../libs/stats.js";

// Los retos se validan SIEMPRE contra el historial de partidas (regla de negocio):
// no existe un endpoint para "marcar" un reto como completado.
export const evaluateChallenges = (stats) =>
    CHALLENGES.map((c) => {
        const value = stats[c.metric] ?? 0;
        return {
            ...c,
            value,
            progress: Math.min(100, Math.round((value / c.target) * 100)),
            completed: value >= c.target
        };
    });

export const getChallenges = async (req, res) => {
    const games = await Game.find({ user: req.user.id });
    const challenges = evaluateChallenges(computeStats(games));

    res.json({
        challenges,
        badges: challenges.filter((c) => c.completed).map(({ id, title, badge }) => ({ id, title, badge }))
    });
};

// Tabla de clasificación de los jugadores del mismo grupo o liga
export const getLeaderboard = async (req, res) => {
    const me = await User.findById(req.user.id);
    const players = await User.find({ group: me.group, role: "jugador" });

    const rows = await Promise.all(
        players.map(async (p) => {
            const stats = computeStats(await Game.find({ user: p._id }));
            return {
                id: p._id,
                username: p.username,
                level: p.level,
                gamesPlayed: stats.gamesPlayed,
                average: stats.average,
                bestScore: stats.bestScore,
                isMe: String(p._id) === String(me._id)
            };
        })
    );

    rows.sort((a, b) => b.average - a.average || b.bestScore - a.bestScore);

    res.json({ group: me.group, ranking: rows.map((r, i) => ({ position: i + 1, ...r })) });
};
