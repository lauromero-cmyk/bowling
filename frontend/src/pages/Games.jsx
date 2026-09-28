import { useEffect, useMemo, useState } from 'react'
import AppNav from '../components/AppNav'
import ScoreSheet from '../components/ScoreSheet'
import LineChart from '../components/LineChart'
import api, { errorMessage } from '../api/axios'
import { calculateGame } from '../utils/bowling'
import { nextRoll, addRoll, undoRoll } from '../utils/scoresheet'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

function Games() {
  const [frames, setFrames] = useState([])
  const [place, setPlace] = useState('')
  const [games, setGames] = useState([])
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(null)

  const load = async () => {
    try {
      const [g, s] = await Promise.all([api.get('/games'), api.get('/games/stats')])
      setGames(g.data)
      setStats(s.data)
    } catch (err) {
      setError(errorMessage(err, 'No se pudo cargar el historial.'))
    }
  }

  useEffect(() => { load() }, [])

  const next = nextRoll(frames)
  const live = useMemo(() => calculateGame(frames, { complete: false }), [frames])
  const finished = next === null

  const save = async () => {
    try {
      setSaving(true)
      setError('')
      const { data } = await api.post('/games', { frames, place })
      setMessage(`Partida guardada: ${data.total} puntos.`)
      setFrames([])
      setPlace('')
      load()
    } catch (err) {
      setError(errorMessage(err, 'No se pudo guardar la partida.'))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar esta partida?')) return
    await api.delete(`/games/${id}`)
    load()
  }

  return (
    <div className="section-page">
      <AppNav />

      <main className="section-container">
        <header className="section-header">
          <p className="tag">REGISTRO DE PARTIDAS</p>
          <h1>Anota cada <span>frame.</span></h1>
          <p>Toca los pines derribados en cada lanzamiento. El puntaje se calcula con las reglas oficiales.</p>
        </header>

        <section className="card">
          <div className="card-head">
            <h2>Nueva partida</h2>
            <span className="live-total">Total: <strong>{live.total}</strong></span>
          </div>

          <ScoreSheet
            frames={frames}
            cumulative={live.frames.map((f) => f.cumulative)}
            current={next?.frame}
          />

          {!finished ? (
            <>
              <p className="keypad-label">
                Frame {next.frame + 1} · lanzamiento {next.roll + 1} — ¿cuántos pines derribaste?
              </p>
              <div className="keypad">
                {Array.from({ length: 11 }, (_, n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pin-button ${n === 10 ? 'strike' : ''}`}
                    disabled={n > next.max}
                    onClick={() => { setMessage(''); setFrames(addRoll(frames, n)) }}
                  >
                    {n === 10 && next.roll === 0 ? 'X' : n}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="save-row">
              <input
                className="text-input"
                placeholder="Lugar (opcional)"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
              <button type="button" className="main-button" onClick={save} disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar partida'}
              </button>
            </div>
          )}

          <div className="row-actions">
            <button type="button" className="secondary-button" onClick={() => setFrames(undoRoll(frames))} disabled={!frames.length}>
              Deshacer
            </button>
            <button type="button" className="secondary-button" onClick={() => setFrames([])} disabled={!frames.length}>
              Reiniciar
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}
        </section>

        {stats && stats.gamesPlayed > 0 && (
          <>
            <section className="stats-grid">
              <div className="progress-stat-card"><span className="stat-number">{stats.average}</span><span className="stat-label">Promedio</span></div>
              <div className="progress-stat-card"><span className="stat-number">{stats.bestScore}</span><span className="stat-label">Mejor partida</span></div>
              <div className="progress-stat-card"><span className="stat-number">{stats.strikePercentage}%</span><span className="stat-label">Strikes</span></div>
              <div className="progress-stat-card"><span className="stat-number">{stats.sparePercentage}%</span><span className="stat-label">Spares</span></div>
              <div className="progress-stat-card"><span className="stat-number">{stats.pinsPerGame}</span><span className="stat-label">Pines por partida</span></div>
              <div className="progress-stat-card"><span className="stat-number">{stats.gamesPlayed}</span><span className="stat-label">Partidas</span></div>
            </section>

            <section className="card">
              <h2>Evolución del puntaje</h2>
              <LineChart points={stats.evolution.map((e) => ({ label: `P${e.game}`, y: e.total }))} />
            </section>

            <section className="card">
              <h2>Recomendaciones</h2>
              <ul className="clean-list">
                {stats.recommendations.map((r, i) => <li key={i}>{r.text}</li>)}
              </ul>
            </section>
          </>
        )}

        <section className="card">
          <h2>Historial</h2>
          {games.length === 0 && <p className="muted">Todavía no registras partidas.</p>}
          <div className="history-list">
            {games.map((g) => (
              <article key={g._id} className="history-item">
                <button type="button" className="history-summary" onClick={() => setOpen(open === g._id ? null : g._id)}>
                  <span className="history-score">{g.total}</span>
                  <span>
                    <strong>{formatDate(g.date)}</strong>
                    <small>{g.place || 'Sin lugar'} · {g.strikes} strikes · {g.spares} spares</small>
                  </span>
                  <span className="muted">{open === g._id ? 'Ocultar' : 'Ver'}</span>
                </button>
                {open === g._id && (
                  <div className="history-detail">
                    <ScoreSheet frames={g.frames.map((f) => f.rolls)} cumulative={g.frames.map((f) => f.cumulative)} />
                    <button type="button" className="danger-link" onClick={() => remove(g._id)}>Eliminar partida</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Games
