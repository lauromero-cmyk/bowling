import { marks } from '../utils/scoresheet'

// Hoja de puntaje de 10 frames (en vivo o de una partida guardada)
function ScoreSheet({ frames, cumulative, current }) {
  return (
    <div className="scoresheet">
      {Array.from({ length: 10 }, (_, i) => {
        const rolls = frames[i] || []
        const m = marks(rolls, i)
        const slots = i === 9 ? 3 : 2
        return (
          <div key={i} className={`score-frame ${current === i ? 'current' : ''}`}>
            <div className="score-frame-number">{i + 1}</div>
            <div className="score-rolls">
              {Array.from({ length: slots }, (_, k) => (
                <span key={k} className={`score-roll ${m[k] === 'X' || m[k] === '/' ? 'mark' : ''}`}>
                  {m[k] ?? ''}
                </span>
              ))}
            </div>
            <div className="score-total">{cumulative[i] ?? ''}</div>
          </div>
        )
      })}
    </div>
  )
}

export default ScoreSheet
