import { useEffect, useState } from 'react'
import AppNav from '../components/AppNav'
import api, { errorMessage } from '../api/axios'

function Challenges() {
  const [data, setData] = useState(null)
  const [board, setBoard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/challenges'), api.get('/leaderboard')])
      .then(([c, l]) => { setData(c.data); setBoard(l.data) })
      .catch((err) => setError(errorMessage(err, 'No se pudieron cargar los retos.')))
  }, [])

  return (
    <div className="section-page">
      <AppNav />
      <main className="section-container">
        <header className="section-header">
          <p className="tag">RETOS Y LOGROS</p>
          <h1>Supera cada <span>reto.</span></h1>
          <p>Los retos se validan automáticamente con las partidas que registras.</p>
        </header>

        {error && <p className="form-error">{error}</p>}

        {data && (
          <>
            <section className="card">
              <h2>Mis insignias ({data.badges.length})</h2>
              {data.badges.length === 0 && <p className="muted">Registra partidas para desbloquear insignias.</p>}
              <div className="badge-row">
                {data.badges.map((b) => (
                  <div key={b.id} className="badge"><span>{b.badge}</span>{b.title}</div>
                ))}
              </div>
            </section>

            <section className="challenge-grid">
              {data.challenges.map((c) => (
                <article key={c.id} className={`challenge-card ${c.completed ? 'done' : ''}`}>
                  <div className="challenge-icon">{c.badge}</div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <div className="bar"><div style={{ width: `${c.progress}%` }} /></div>
                  <small>{c.completed ? 'Completado' : `${c.value} / ${c.target}`}</small>
                </article>
              ))}
            </section>
          </>
        )}

        {board && (
          <section className="card">
            <h2>Clasificación · grupo {board.group}</h2>
            <table className="table">
              <thead>
                <tr><th>#</th><th>Jugador</th><th>Nivel</th><th>Partidas</th><th>Promedio</th><th>Mejor</th></tr>
              </thead>
              <tbody>
                {board.ranking.map((r) => (
                  <tr key={r.id} className={r.isMe ? 'me' : ''}>
                    <td>{r.position}</td>
                    <td>{r.username}{r.isMe ? ' (tú)' : ''}</td>
                    <td>{r.level}</td>
                    <td>{r.gamesPlayed}</td>
                    <td>{r.average}</td>
                    <td>{r.bestScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  )
}

export default Challenges
