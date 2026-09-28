import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import AppNav from '../components/AppNav'
import api from '../api/axios'

const MODULES = [
  { to: '/lecciones', n: '01', title: 'Lecciones', text: 'Postura, agarre, aproximación, tipos de lanzamiento, lectura de pista y spares.' },
  { to: '/partidas', n: '02', title: 'Partidas', text: 'Registra tus partidas frame por frame con cálculo oficial del puntaje.' },
  { to: '/entrenamiento', n: '03', title: 'Entrenamiento', text: 'Rutinas de precisión, velocidad, spare y strike con seguimiento de intentos.' },
  { to: '/retos', n: '04', title: 'Retos', text: 'Desbloquea insignias y compite en la tabla de tu liga.' },
]

function Home() {

  const navigate = useNavigate()
  const { user } = useUser()
  const [notifications, setNotifications] = useState([])

  const profile = user?.profile || {}
  const profileName = profile.username || 'Jugador'

  useEffect(() => {
    api.get('/notifications')
      .then(({ data }) => setNotifications(data))
      .catch(() => setNotifications([]))
  }, [])

  return (
    <div className="app">

      <AppNav />

      <main className="home-main home-stack">

        {notifications.length > 0 && (
          <div className="notifications">
            {notifications.map((n, i) => (
              <button
                key={i}
                type="button"
                className={`notification ${n.type}`}
                onClick={() => n.type === 'feedback' ? navigate('/mensajes') : n.type === 'achievement' ? navigate('/retos') : null}
              >
                {n.type === 'tip' ? '💡' : n.type === 'feedback' ? '💬' : '🏆'} {n.text}
              </button>
            ))}
          </div>
        )}

        <section className="hero">

          <div className="hero-content">

            <p className="tag">
              HOLA, {profileName.toUpperCase()} · NIVEL {(profile.level || 'principiante').toUpperCase()}
            </p>

            <h1>
              Mejora tu juego.
              <br />
              <span>Domina la pista.</span>
            </h1>

            <p className="hero-text">
              Una plataforma para aprender la técnica, registrar tus
              partidas, entrenar y seguir tu evolución como jugador.
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="main-button"
                onClick={() => navigate('/lecciones')}
              >
                Continuar aprendiendo
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate('/partidas')}
              >
                Registrar partida
              </button>

            </div>

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

        <section className="training-grid home-modules">
          {MODULES.map((m) => (
            <article key={m.to} className="training-card">
              <div className="training-number">{m.n}</div>
              <h2>{m.title}</h2>
              <p>{m.text}</p>
              <button type="button" onClick={() => navigate(m.to)}>Entrar →</button>
            </article>
          ))}
        </section>

      </main>

    </div>
  )
}

export default Home
