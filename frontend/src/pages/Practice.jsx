import { API_URL } from '../api/config'
import AppNav from '../components/AppNav'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const practiceData = {
  precision: {
    title: 'Precisión',
    description:
      'Trabaja tu puntería y aprende a controlar la dirección de cada lanzamiento.',
    objective:
      'Mejora la precisión de tus lanzamientos y mantén una dirección constante.',
    exercises: [
      'Apunta al mismo punto de referencia en cada lanzamiento.',
      'Mantén una postura estable antes de lanzar.',
      'Controla el movimiento del brazo durante el lanzamiento.',
      'Registra tus resultados para comparar tu progreso.'
    ]
  },

  velocidad: {
    title: 'Velocidad',
    description:
      'Aprende a controlar la velocidad de la bola para conseguir lanzamientos más consistentes.',
    objective:
      'Encuentra una velocidad cómoda y mantenla durante tus lanzamientos.',
    exercises: [
      'Realiza varios lanzamientos manteniendo una velocidad similar.',
      'Evita aumentar la fuerza innecesariamente.',
      'Observa cómo cambia el lanzamiento según la velocidad.',
      'Registra tus resultados para analizar tu consistencia.'
    ]
  },

  spare: {
    title: 'Spare',
    description:
      'Mejora tus lanzamientos después del primer tiro y aumenta tus posibilidades de conseguir un spare.',
    objective:
      'Aprende a identificar y atacar los pines restantes después del primer lanzamiento.',
    exercises: [
      'Identifica los pines que quedaron después del primer lanzamiento.',
      'Selecciona un punto de referencia para tu tiro.',
      'Realiza el lanzamiento intentando cubrir los pines restantes.',
      'Registra cuántos spares consigues.'
    ]
  },

  strike: {
    title: 'Strike',
    description:
      'Perfecciona tu técnica y aprende a buscar lanzamientos más efectivos.',
    objective:
      'Mejora la consistencia de tus lanzamientos para aumentar tus posibilidades de conseguir un strike.',
    exercises: [
      'Adopta una posición inicial estable.',
      'Selecciona un punto de referencia en la pista.',
      'Mantén un movimiento de lanzamiento controlado.',
      'Registra tus lanzamientos y analiza tus resultados.'
    ]
  }
}

function Practice() {
  const navigate = useNavigate()
  const { type } = useParams()
  const { user, logout } = useUser()

  const practice = practiceData[type]

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState('')

  const [elapsed, setElapsed] = useState(0)

  // API_URL viene de ../api/config

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.token}`
  }

  useEffect(() => {
    if (!user?.token) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    if (!session || session.status !== 'in_progress') {
      return
    }

    const interval = setInterval(() => {
      const start = new Date(session.startedAt).getTime()
      const now = Date.now()

      setElapsed(
        Math.floor((now - start) / 1000)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [session])

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }

  const startPractice = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/training/start`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ type })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'No se pudo iniciar la práctica.'
        )
      }

      if (data.type !== type) {
        const corrected = {
          ...data,
          type
        }

        setSession(corrected)
      } else {
        setSession(data)
      }

      setElapsed(0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const registerAttempt = async successful => {
    if (!session) return

    try {
      setError('')

      const response = await fetch(
        `${API_URL}/training/${session._id}/attempt`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            successful
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'No se pudo registrar el lanzamiento.'
        )
      }

      setSession(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const finishPractice = async () => {
    if (!session) return

    try {
      setFinishing(true)
      setError('')

      const response = await fetch(
        `${API_URL}/training/${session._id}/finish`,
        {
          method: 'POST',
          headers
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'No se pudo finalizar la práctica.'
        )
      }

      setSession(data)

      navigate('/progreso')
    } catch (err) {
      setError(err.message)
    } finally {
      setFinishing(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!practice) {
    return (
      <div className="training-page">
        <AppNav />

        <main className="practice-container">
          <section className="practice-main-card">
            <p className="tag">
              BOWLINGPRO
            </p>

            <h1>
              Práctica no encontrada
            </h1>

            <button
              type="button"
              className="main-button"
              onClick={() => navigate('/entrenamiento')}
            >
              Volver a entrenamiento
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="training-page">
      <AppNav />

      <main className="practice-container">
        <header className="practice-header">
          <p className="tag">
            PRÁCTICA
          </p>

          <h1>
            Entrenamiento de
            <br />
            <span>{practice.title}.</span>
          </h1>

          <p>
            {practice.description}
          </p>
        </header>

        {!session && (
          <section className="practice-main-card">
            <div className="practice-intro">
              <p className="tag">
                OBJETIVO
              </p>

              <h2>
                {practice.objective}
              </h2>
            </div>

            <div className="practice-exercises">
              <h3>
                Ejercicios de práctica
              </h3>

              {practice.exercises.map(
                (exercise, index) => (
                  <div
                    className="exercise-item"
                    key={index}
                  >
                    <span>
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <p>
                      {exercise}
                    </p>
                  </div>
                )
              )}
            </div>

            {error && (
              <div className="task-error">
                {error}
              </div>
            )}

            <div className="practice-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate('/entrenamiento')
                }
              >
                Volver
              </button>

              <button
                type="button"
                className="main-button"
                onClick={startPractice}
                disabled={loading}
              >
                {loading
                  ? 'Iniciando...'
                  : 'Iniciar práctica'}
              </button>
            </div>
          </section>
        )}

        {session && (
          <section className="practice-session-card">
            <div className="session-top">
              <div>
                <p className="tag">
                  PRÁCTICA EN CURSO
                </p>

                <h2>
                  {practice.title}
                </h2>
              </div>

              <div className="session-timer">
                {formatTime(elapsed)}
              </div>
            </div>

            <div className="session-stats">
              <div className="session-stat">
                <strong>
                  {session.totalAttempts}
                </strong>

                <span>
                  Lanzamientos
                </span>
              </div>

              <div className="session-stat">
                <strong>
                  {session.successfulAttempts}
                </strong>

                <span>
                  Acertados
                </span>
              </div>

              <div className="session-stat">
                <strong>
                  {session.accuracy}%
                </strong>

                <span>
                  Precisión
                </span>
              </div>
            </div>

            {error && (
              <div className="task-error">
                {error}
              </div>
            )}

            <div className="attempt-actions">
              <button
                type="button"
                className="attempt-success"
                onClick={() =>
                  registerAttempt(true)
                }
              >
                ✓ Lanzamiento acertado
              </button>

              <button
                type="button"
                className="attempt-failed"
                onClick={() =>
                  registerAttempt(false)
                }
              >
                ✕ Lanzamiento fallido
              </button>
            </div>

            <div className="attempt-history">
              <div className="attempt-history-header">
                <h3>
                  Lanzamientos registrados
                </h3>

                <span>
                  {session.attempts.length}
                </span>
              </div>

              {session.attempts.length === 0 ? (
                <p className="empty-message">
                  Todavía no has registrado
                  lanzamientos.
                </p>
              ) : (
                <div className="attempt-list">
                  {session.attempts
                    .slice()
                    .reverse()
                    .map(attempt => (
                      <div
                        className="attempt-row"
                        key={attempt._id}
                      >
                        <span>
                          {String(
                            attempt.number
                          ).padStart(2, '0')}
                        </span>

                        <strong
                          className={
                            attempt.successful
                              ? 'attempt-good'
                              : 'attempt-bad'
                          }
                        >
                          {attempt.successful
                            ? 'Acertado'
                            : 'Fallido'}
                        </strong>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="practice-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate('/entrenamiento')
                }
              >
                Salir
              </button>

              <button
                type="button"
                className="main-button"
                onClick={finishPractice}
                disabled={finishing}
              >
                {finishing
                  ? 'Guardando...'
                  : 'Finalizar práctica'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Practice