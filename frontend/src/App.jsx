import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import api from './api/axios'
import { useUser } from './context/UserContext'
import ProtectedRoute from './pages/ProtectedRoute'
import Tasks from './pages/Task'
import './App.css'

function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const { user, login, logout } = useUser()
  const loggedIn = !!user
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const openLogin = () => {
    setError('')
    setEmail('')
    setPassword('')
    setShowLogin(true)
  }

  const closeLogin = () => {
    setShowLogin(false)
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/api/login', {
        email,
        password,
      })

      if (response.data.token) {
        login(response.data.token)

        setShowLogin(false)
        setEmail('')
        setPassword('')
        setError('')

        navigate('/tareas')
      } else {
        setError('El servidor no devolvió un token')
      }
    } catch (error) {
      console.error('ERROR LOGIN:', error)

      if (error.response) {
        if (typeof error.response.data === 'string') {
          setError(error.response.data)
        } else if (error.response.data?.message) {
          setError(error.response.data.message)
        } else {
          setError('Correo o contraseña incorrectos')
        }
      } else if (error.request) {
        setError(
          'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 3000.'
        )
      } else {
        setError('Ocurrió un error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const startTraining = () => {
    const section = document.getElementById('entrenamiento')

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  const goToProgress = () => {
    const section = document.getElementById('progreso')

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  const goToTasks = () => {
    navigate('/tareas')
  }

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          <span>Bowling</span>Pro
        </div>

        <div className="nav-links">

          <a href="#inicio">
            Inicio
          </a>

          <a href="#entrenamiento">
            Entrenamiento
          </a>

          <a href="#progreso">
            Progreso
          </a>

          {loggedIn ? (
            <>
              <button
                type="button"
                className="nav-button"
                onClick={goToTasks}
              >
                Mis tareas
              </button>

              <button
                type="button"
                className="nav-button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              className="nav-button"
              onClick={openLogin}
            >
              Iniciar sesión
            </button>
          )}

        </div>

      </nav>

      <main>

        <section
          id="inicio"
          className="hero"
        >

          <div className="hero-content">

            <p className="tag">
              TU ENTRENADOR DE BOWLING
            </p>

            <h1>
              Mejora tu juego.
              <br />
              <span>
                Domina la pista.
              </span>
            </h1>

            <p className="hero-text">
              Practica, registra tus entrenamientos
              y mejora tu precisión, velocidad y
              técnica.
            </p>

            <button
              type="button"
              className="main-button"
              onClick={startTraining}
            >
              Comenzar entrenamiento
            </button>

          </div>

          <div className="hero-ball">

            <div className="glow"></div>

            <div className="bowling-ball">

              <div className="ball-hole one"></div>
              <div className="ball-hole two"></div>
              <div className="ball-hole three"></div>

            </div>

          </div>

        </section>

        <section
          id="entrenamiento"
          className="features"
        >

          <div className="section-title">

            <p>
              ENTRENAMIENTO
            </p>

            <h2>
              Todo para mejorar tu juego
            </h2>

          </div>

          <div className="cards">

            <article className="card">

              <div className="card-icon pink"></div>

              <h3>
                Precisión
              </h3>

              <p>
                Trabaja tus lanzamientos y mejora
                tu puntería.
              </p>

            </article>

            <article className="card">

              <div className="card-icon purple"></div>

              <h3>
                Velocidad
              </h3>

              <p>
                Registra y analiza la velocidad
                de tus lanzamientos.
              </p>

            </article>

            <article className="card">

              <div className="card-icon blue"></div>

              <h3>
                Progreso
              </h3>

              <p>
                Consulta tus entrenamientos y
                observa tu evolución.
              </p>

            </article>

          </div>

          <div className="training-button-container">

            <button
              type="button"
              className="secondary-button"
              onClick={goToProgress}
            >
              Ver mi progreso
            </button>

          </div>

        </section>

        <section
          id="progreso"
          className="progress-section"
        >

          <div className="progress-content">

            <p className="tag">
              TU PROGRESO
            </p>

            <h2>
              Cada lanzamiento cuenta.
            </h2>

            <p>
              Guarda tus entrenamientos y descubre
              cómo vas mejorando con cada práctica.
            </p>

            <div className="stats">

              <div>
                <strong>
                  0
                </strong>

                <span>
                  Entrenamientos
                </span>
              </div>

              <div>
                <strong>
                  0%
                </strong>

                <span>
                  Precisión
                </span>
              </div>

              <div>
                <strong>
                  0
                </strong>

                <span>
                  Partidas
                </span>
              </div>

            </div>

            {!loggedIn && (
              <button
                type="button"
                className="secondary-button progress-button"
                onClick={openLogin}
              >
                Inicia sesión para comenzar
              </button>
            )}

            {loggedIn && (
              <button
                type="button"
                className="secondary-button progress-button"
                onClick={goToTasks}
              >
                Ir a mis tareas
              </button>
            )}

          </div>

        </section>

      </main>

      <footer>

        <div>
          <strong>
            BowlingPro
          </strong>
        </div>

        <p>
          Entrena. Mejora. Domina la pista.
        </p>

      </footer>

      {showLogin && (

        <div
          className="login-overlay"
          onClick={closeLogin}
        >

          <div
            className="login-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="close-login"
              onClick={closeLogin}
            >
              ×
            </button>

            <p className="login-tag">
              BOWLINGPRO
            </p>

            <h2>
              Bienvenida
            </h2>

            <p className="login-subtitle">
              Inicia sesión para continuar
            </p>

            <form onSubmit={handleLogin}>

              <label>
                Correo electrónico
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="tu correo"
                autoComplete="email"
                required
              />

              <label>
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="tu contraseña"
                autoComplete="current-password"
                required
              />

              {error && (
                <p className="login-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? 'Ingresando...'
                  : 'Iniciar sesión'}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/tareas"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App