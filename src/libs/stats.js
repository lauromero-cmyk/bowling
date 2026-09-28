// Estadísticas de un jugador a partir de su historial de partidas.
export function computeStats(games) {
    const gamesPlayed = games.length;

    if (!gamesPlayed) {
        return {
            gamesPlayed: 0,
            average: 0,
            bestScore: 0,
            strikePercentage: 0,
            sparePercentage: 0,
            pinsPerGame: 0,
            maxStrikesInGame: 0,
            maxSparesInGame: 0,
            maxStrikeStreak: 0,
            evolution: []
        };
    }

    const sum = (fn) => games.reduce((acc, g) => acc + fn(g), 0);

    const totalFrames = gamesPlayed * 10;
    const strikes = sum((g) => g.strikes);
    const spares = sum((g) => g.spares);
    const spareChances = totalFrames - strikes;

    // Racha máxima de strikes consecutivos dentro de una partida
    const streakOf = (g) => {
        const marks = [];
        g.frames.forEach((f) => {
            const [r1, r2, r3] = f.rolls;
            if (f.frame < 10) {
                marks.push(r1 === 10);
                return;
            }
            marks.push(r1 === 10);
            if (r2 !== undefined) marks.push(r1 === 10 && r2 === 10);
            if (r3 !== undefined) marks.push(r3 === 10 && (r2 === 10 || (r1 < 10 && r1 + r2 === 10)));
        });
        let best = 0;
        let current = 0;
        marks.forEach((isStrike) => {
            current = isStrike ? current + 1 : 0;
            best = Math.max(best, current);
        });
        return best;
    };

    const sorted = [...games].sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
        gamesPlayed,
        average: Number((sum((g) => g.total) / gamesPlayed).toFixed(1)),
        bestScore: Math.max(...games.map((g) => g.total)),
        strikePercentage: Number(((strikes / totalFrames) * 100).toFixed(1)),
        sparePercentage: spareChances ? Number(((spares / spareChances) * 100).toFixed(1)) : 0,
        pinsPerGame: Number((sum((g) => g.pins) / gamesPlayed).toFixed(1)),
        maxStrikesInGame: Math.max(...games.map((g) => g.strikes)),
        maxSparesInGame: Math.max(...games.map((g) => g.spares)),
        maxStrikeStreak: Math.max(...games.map(streakOf)),
        evolution: sorted.map((g, i) => ({
            game: i + 1,
            date: g.date,
            total: g.total
        }))
    };
}

// Recomendaciones automáticas según las estadísticas (RF-19)
export function recommend(stats) {
    const tips = [];

    if (stats.gamesPlayed === 0) {
        return [{ type: "precision", text: "Registra tu primera partida para recibir recomendaciones personalizadas." }];
    }
    if (stats.sparePercentage < 40) {
        tips.push({ type: "spare", text: `Tu porcentaje de spares es ${stats.sparePercentage}%. Practica la rutina de Spare y el tiro cruzado.` });
    }
    if (stats.strikePercentage < 20) {
        tips.push({ type: "strike", text: `Tu porcentaje de strikes es ${stats.strikePercentage}%. Trabaja la entrada al bolsillo con la rutina de Strike.` });
    }
    if (stats.average < 100) {
        tips.push({ type: "precision", text: `Tu promedio es ${stats.average}. Refuerza la precisión: apunta siempre a la misma flecha.` });
    }
    if (!tips.length) {
        tips.push({ type: "velocidad", text: "¡Vas muy bien! Trabaja la consistencia de velocidad para subir tu promedio." });
    }
    return tips;
}
