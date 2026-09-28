// Ayudas para la hoja de puntaje en la pantalla de registro de partidas.

// Devuelve el frame y el máximo de pines permitido para el siguiente lanzamiento,
// o null si la partida ya terminó.
export function nextRoll(frames) {
  const last = frames[frames.length - 1]
  const i = frames.length - 1

  const frameDone = (f, idx) => {
    if (!f) return true
    if (idx < 9) return f[0] === 10 || f.length === 2
    const [r1, r2] = f
    if (f.length < 2) return false
    const needed = r1 === 10 || r1 + r2 === 10 ? 3 : 2
    return f.length >= needed
  }

  let index = i
  let rolls = last || []

  if (frames.length === 0 || frameDone(last, i)) {
    if (frames.length === 10) return null
    index = frames.length
    rolls = []
  }

  const [r1, r2] = rolls
  let max = 10

  if (rolls.length === 1) {
    max = index === 9 && r1 === 10 ? 10 : 10 - r1
  } else if (rolls.length === 2) {
    // solo pasa en el décimo frame
    max = r1 === 10 ? (r2 === 10 ? 10 : 10 - r2) : 10
  }

  return { frame: index, roll: rolls.length, max }
}

// Agrega un lanzamiento a la lista de frames
export function addRoll(frames, pins) {
  const next = nextRoll(frames)
  if (!next || pins > next.max) return frames
  const copy = frames.map((f) => [...f])
  if (next.roll === 0) copy.push([pins])
  else copy[next.frame].push(pins)
  return copy
}

export function undoRoll(frames) {
  const copy = frames.map((f) => [...f])
  const last = copy[copy.length - 1]
  if (!last) return copy
  last.pop()
  if (last.length === 0) copy.pop()
  return copy
}

// Símbolos oficiales: X strike, / spare, - cero
export function marks(rolls, index) {
  const d = (n) => (n === 0 ? '-' : String(n))
  const [r1, r2, r3] = rolls

  if (r1 === undefined) return []

  if (index < 9) {
    if (r1 === 10) return ['', 'X']
    const out = [d(r1)]
    if (r2 !== undefined) out.push(r1 + r2 === 10 ? '/' : d(r2))
    return out
  }

  const out = []
  if (r1 !== undefined) out.push(r1 === 10 ? 'X' : d(r1))
  if (r2 !== undefined) {
    if (r1 === 10) out.push(r2 === 10 ? 'X' : d(r2))
    else out.push(r1 + r2 === 10 ? '/' : d(r2))
  }
  if (r3 !== undefined) {
    if (r1 === 10 && r2 !== 10) out.push(r2 + r3 === 10 ? '/' : d(r3))
    else out.push(r3 === 10 ? 'X' : d(r3))
  }
  return out
}
