import Game from "../models/game.model.js";
import { calculateGame, BowlingError } from "../libs/bowling.js";
import { computeStats, recommend } from "../libs/stats.js";

// Registra una partida. El puntaje SIEMPRE se calcula en el servidor (regla de negocio).
export const createGame = async (req, res) => {
    try {
        const { frames, place, date } = req.body;

        const result = calculateGame(frames);

        const game = await Game.create({
            user: req.user.id,
            place: place || "",
            date: date || new Date(),
            frames: result.frames,
            total: result.total,
            strikes: result.stats.strikes,
            spares: result.stats.spares,
            pins: result.stats.pins,
            strikePercentage: result.stats.strikePercentage,
            sparePercentage: result.stats.sparePercentage
        });

        res.status(201).json(game);
    } catch (error) {
        if (error instanceof BowlingError) {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        res.status(500).json({ message: "Error al registrar la partida" });
    }
};

export const getGames = async (req, res) => {
    const games = await Game.find({ user: req.user.id }).sort({ date: -1 });
    res.json(games);
};

export const getGame = async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id, user: req.user.id });
        if (!game) return res.status(404).json({ message: "Partida no encontrada" });
        res.json(game);
    } catch {
        res.status(404).json({ message: "Partida no encontrada" });
    }
};

export const deleteGame = async (req, res) => {
    try {
        const game = await Game.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!game) return res.status(404).json({ message: "Partida no encontrada" });
        res.json({ message: "Partida eliminada" });
    } catch {
        res.status(404).json({ message: "Partida no encontrada" });
    }
};

export const getGameStats = async (req, res) => {
    const games = await Game.find({ user: req.user.id });
    const stats = computeStats(games);
    res.json({ ...stats, recommendations: recommend(stats) });
};
