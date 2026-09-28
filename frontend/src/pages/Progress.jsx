import { API_URL } from '../api/config'
import AppNav from '../components/AppNav'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Progress() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // API_URL viene de ../api/config

  useEffect(() => {
    if (!user?.token) {
      navigate('/login')
      return
    }

    loadStats()
  }, [user, navigate])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/training/stats`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'No se pudo cargar el progreso.'
        )
      }

      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = date => {
    if (!date) return ''

    return new Date(date).toLocaleDateString(
      'es-CO',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }

  const getPracticeName = type => {
    const names = {
      precision: 'Precisión',
      velocidad: 'Velocidad',
      spare: 'Spare',
      strike: 'Strike'
    }

    return names[type] || type
  }

  return (
    <div className="progress-page">
      <AppNav />

      <main className="progress-container">
        <header className="progress-header">
          <p className="tag">
            TU PROGRESO
          </p>

          <h1>
            Cada lanzamiento
            <br />
            <span>cuenta.</span>
          </h1>

          <p>
            Consulta tu evolución y observa cómo
            avanzas en tu entrenamiento de BowlingPro.
          </p>
        </header>

        {loading && (
          <section className="progress-detail">
            <h2>
              Cargando tu progreso...
            </h2>
          </section>
        )}

        {error && (
          <section className="progress-detail">
            <h2>
              No pudimos cargar tu progreso
            </h2>

            <p>
              {error}
            </p>

            <button
              className="main-button"
              onClick={loadStats}
            >
              Intentar nuevamente
            </button>
          </section>
        )}

        {!loading && !error && stats && (
          <>
            <section className="progress-stats">
              <article className="progress-stat-card">
                <span className="stat-number">
                  {stats.totalTrainings}
                </span>

                <span className="stat-label">
                  Entrenamientos
                </span>
              </article>

              <article className="progress-stat-card">
                <span className="stat-number">
                  {stats.averageAccuracy}%
                </span>

                <span className="stat-label">
                  Precisión promedio
                </span>
              </article>

              <article className="progress-stat-card">
                <span className="stat-number">
                  {stats.totalAttempts}
                </span>

                <span className="stat-label">
                  Lanzamientos
                </span>
              </article>

              <article className="progress-stat-card">
                <span className="stat-number">
                  {stats.totalSuccessful}
                </span>

                <span className="stat-label">
                  Lanzamientos acertados
                </span>
              </article>
            </section>

            <section className="progress-detail">
              <div>
                <p className="tag">
                  RESUMEN
                </p>

                <h2>
                  Tu evolución se actualiza automáticamente.
                </h2>

                <p>
                  Cada práctica finalizada se guarda
                  y sus resultados se utilizan para
                  calcular tus estadísticas.
                </p>

                {stats.totalTrainings === 0 && (
                  <button
                    className="main-button"
                    onClick={() =>
                      navigate('/entrenamiento')
                    }
                  >
                    Comenzar entrenamiento
                  </button>
                )}
              </div>

              <div className="progress-circle">
                {stats.averageAccuracy}%
              </div>
            </section>

            <section className="progress-history">
              <div className="progress-history-header">
                <div>
                  <p className="tag">
                    HISTORIAL
                  </p>

                  <h2>
                    Tus últimas prácticas
                  </h2>
                </div>

                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate('/entrenamiento')
                  }
                >
                  Nueva práctica
                </button>
              </div>

              {stats.recentSessions.length === 0 ? (
                <div className="progress-empty">
                  <p>
                    Todavía no tienes prácticas
                    registradas.
                  </p>
                </div>
              ) : (
                <div className="progress-history-list">
                  {stats.recentSessions.map(
                    session => (
                      <article
                        className="progress-history-card"
                        key={session._id}
                      >
                        <div>
                          <span className="history-type">
                            {getPracticeName(
                              session.type
                            )}
                          </span>

                          <h3>
                            Práctica completada
                          </h3>

                          <p>
                            {formatDate(
                              session.completedAt
                            )}
                          </p>
                        </div>

                        <div className="history-result">
                          <strong>
                            {session.accuracy}%
                          </strong>

                          <span>
                            {session.totalAttempts}{' '}
                            lanzamientos
                          </span>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Progress