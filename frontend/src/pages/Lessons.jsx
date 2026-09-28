import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNav from '../components/AppNav'
import api, { errorMessage } from '../api/axios'

const LEVELS = [
  { id: 'principiante', label: 'Principiante' },
  { id: 'intermedio', label: 'Intermedio' },
  { id: 'avanzado', label: 'Avanzado' },
]

function Lessons() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/lessons')
      .then(({ data }) => setData(data))
      .catch((err) => setError(errorMessage(err, 'No se pudieron cargar las lecciones.')))
  }, [])

  return (
    <div className="section-page">
      <AppNav />
      <main className="section-container">
        <header className="section-header">
          <p className="tag">MÓDULO DE APRENDIZAJE</p>
          <h1>Aprende paso <span>a paso.</span></h1>
          {data && (
            <p>
              Tu nivel actual es <strong>{data.level}</strong>. Aprueba todas las evaluaciones del nivel
              (mínimo {data.minScore}%) para desbloquear el siguiente.
            </p>
          )}
        </header>

        {error && <p className="form-error">{error}</p>}

        {data && LEVELS.map((level) => {
          const lessons = data.lessons.filter((l) => l.level === level.id)
          const done = lessons.filter((l) => l.passed).length
          return (
            <section key={level.id} className="level-block">
              <div className="level-head">
                <h2>{level.label}</h2>
                <span className="pill">{done}/{lessons.length} aprobadas</span>
              </div>
              <div className="lesson-grid">
                {lessons.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`lesson-card ${l.locked ? 'locked' : ''} ${l.passed ? 'passed' : ''}`}
                    onClick={() => !l.locked && navigate(`/lecciones/${l.id}`)}
                    disabled={l.locked}
                  >
                    <span className="lesson-status">
                      {l.locked ? '🔒 Bloqueada' : l.passed ? `✓ Aprobada · ${l.bestScore}%` : l.bestScore !== null ? `Último intento ${l.bestScore}%` : 'Disponible'}
                    </span>
                    <h3>{l.title}</h3>
                    <p>{l.summary}</p>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}

export default Lessons
