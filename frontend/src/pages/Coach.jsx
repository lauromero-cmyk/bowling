import { useEffect, useState } from 'react'
import AppNav from '../components/AppNav'
import FeedbackThread from '../components/FeedbackThread'
import api, { errorMessage } from '../api/axios'

function Coach() {
  const [players, setPlayers] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/coach/players')
      .then(({ data }) => setPlayers(data))
      .catch((err) => setError(errorMessage(err, 'No se pudieron cargar los jugadores.')))
  }, [])

  const player = players.find((p) => p.id === selected)

  return (
    <div className="section-page">
      <AppNav />
      <main className="section-container">
        <header className="section-header">
          <p className="tag">PANEL DEL ENTRENADOR</p>
          <h1>Tus <span>jugadores.</span></h1>
          <p>Solo ves a los jugadores de tu grupo. Revisa sus estadísticas y déjales retroalimentación.</p>
        </header>

        {error && <p className="form-error">{error}</p>}

        <section className="card">
          {players.length === 0 && !error && <p className="muted">No hay jugadores en tu grupo todavía.</p>}
          {players.length > 0 && (
            <table className="table">
              <thead>
                <tr><th>Jugador</th><th>Nivel</th><th>Partidas</th><th>Promedio</th><th>Strikes</th><th>Spares</th><th>Entrenos</th><th></th></tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className={selected === p.id ? 'me' : ''}>
                    <td>{p.username}{p.unread > 0 && <span className="pill">{p.unread} nuevos</span>}</td>
                    <td>{p.level}</td>
                    <td>{p.gamesPlayed}</td>
                    <td>{p.average}</td>
                    <td>{p.strikePercentage}%</td>
                    <td>{p.sparePercentage}%</td>
                    <td>{p.trainings}</td>
                    <td><button type="button" className="nav-button" onClick={() => setSelected(p.id)}>Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {player && (
          <section className="card">
            <h2>Retroalimentación para {player.username}</h2>
            <FeedbackThread playerId={player.id} isCoach />
          </section>
        )}
      </main>
    </div>
  )
}

export default Coach
