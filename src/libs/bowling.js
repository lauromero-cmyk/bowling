// Cálculo del puntaje de una partida según las reglas oficiales del bowling.
// Una partida tiene 10 frames. Cada frame es un arreglo con los pines
// derribados en cada lanzamiento, por ejemplo:
//   [10]      -> strike
//   [7, 3]    -> spare
//   [7, 2]    -> frame abierto
//   [10, 10, 10] -> décimo frame con dos lanzamientos de bonificación

export class BowlingError extends Error {
  constructor(message) {
    super(message);
    this.name = "BowlingError";
  }
}

const isPins = (n) => Number.isInteger(n) && n >= 0 && n <= 10;

// Valida un frame. `complete` indica si la partida debe estar terminada.
export function validateFrame(rolls, index, complete = true) {
  const n = index + 1;

  if (!Array.isArray(rolls) || rolls.length === 0) {
    throw new BowlingError(`El frame ${n} no tiene lanzamientos`);
  }

  if (!rolls.every(isPins)) {
    throw new BowlingError(`El frame ${n} tiene valores inválidos (deben ser enteros entre 0 y 10)`);
  }

  const [r1, r2, r3] = rolls;

  if (index < 9) {
    if (r1 === 10) {
      if (rolls.length !== 1) throw new BowlingError(`El frame ${n} es un strike y solo admite un lanzamiento`);
      return;
    }
    if (rolls.length > 2) throw new BowlingError(`El frame ${n} admite máximo dos lanzamientos`);
    if (rolls.length === 1 && complete) throw new BowlingError(`El frame ${n} está incompleto`);
    if (rolls.length === 2 && r1 + r2 > 10) {
      throw new BowlingError(`El frame ${n} suma más de 10 pines`);
    }
    return;
  }

  // Décimo frame
  if (rolls.length > 3) throw new BowlingError("El frame 10 admite máximo tres lanzamientos");

  if (r1 < 10 && r2 !== undefined && r1 + r2 > 10) {
    throw new BowlingError("El frame 10 suma más de 10 pines en los dos primeros lanzamientos");
  }

  const earnsBonus = r1 === 10 || (r2 !== undefined && r1 + r2 === 10);

  if (r3 !== undefined) {
    if (!earnsBonus) throw new BowlingError("El frame 10 solo tiene tercer lanzamiento con strike o spare");
    // Tras un strike, si el segundo no fue strike, el segundo y tercero comparten los 10 pines
    if (r1 === 10 && r2 < 10 && r2 + r3 > 10) {
      throw new BowlingError("El frame 10 suma más de 10 pines en los lanzamientos de bonificación");
    }
  }

  if (complete) {
    const needed = earnsBonus ? 3 : 2;
    if (rolls.length !== needed) throw new BowlingError("El frame 10 está incompleto");
  }
}

// Calcula la partida. Devuelve el puntaje por frame, el acumulado y las estadísticas.
// Si `complete` es false permite partidas en curso (el acumulado queda en null
// para los frames cuyo bono aún no se conoce).
export function calculateGame(frames, { complete = true } = {}) {
  if (!Array.isArray(frames)) throw new BowlingError("Los frames deben ser un arreglo");
  if (frames.length > 10) throw new BowlingError("Una partida tiene máximo 10 frames");
  if (complete && frames.length !== 10) throw new BowlingError("Una partida completa tiene 10 frames");

  frames.forEach((rolls, i) => validateFrame(rolls, i, complete || i < frames.length - 1));

  const rolls = frames.flat();
  const result = [];
  let cursor = 0;
  let total = 0;
  let pending = false;

  let strikes = 0;
  let spares = 0;
  let spareChances = 0;

  frames.forEach((frame, i) => {
    const [r1, r2] = frame;
    let score = null;

    const next = (k) => rolls[cursor + k];

    if (i < 9) {
      if (r1 === 10) {
        strikes++;
        if (next(1) !== undefined && next(2) !== undefined) score = 10 + next(1) + next(2);
        cursor += 1;
      } else {
        spareChances++;
        if (r2 !== undefined && r1 + r2 === 10) {
          spares++;
          if (next(2) !== undefined) score = 10 + next(2);
        } else if (r2 !== undefined) {
          score = r1 + r2;
        }
        cursor += 2;
      }
    } else {
      if (r1 === 10) strikes++;
      else {
        spareChances++;
        if (r2 !== undefined && r1 + r2 === 10) spares++;
      }
      const earnsBonus = r1 === 10 || (r2 !== undefined && r1 + r2 === 10);
      const needed = earnsBonus ? 3 : 2;
      if (frame.length === needed) score = frame.reduce((a, b) => a + b, 0);
    }

    if (score === null) pending = true;
    if (!pending) total += score;

    result.push({
      frame: i + 1,
      rolls: frame,
      type: r1 === 10 ? "strike" : r2 !== undefined && r1 + r2 === 10 ? "spare" : "open",
      score,
      cumulative: pending ? null : total,
    });
  });

  const framesPlayed = frames.length || 1;

  return {
    frames: result,
    total,
    stats: {
      strikes,
      spares,
      pins: rolls.reduce((a, b) => a + b, 0),
      strikePercentage: Number(((strikes / framesPlayed) * 100).toFixed(2)),
      sparePercentage: spareChances ? Number(((spares / spareChances) * 100).toFixed(2)) : 0,
      perfectGame: complete && total === 300,
    },
  };
}
