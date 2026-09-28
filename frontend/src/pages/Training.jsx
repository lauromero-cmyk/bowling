import AppNav from '../components/AppNav'
import { useNavigate } from 'react-router-dom'

function Training() {
  const navigate = useNavigate()

  return (
    <div className="training-page">

      <AppNav />

      <main className="training-container">

        <header className="training-header">

          <p className="tag">
            ENTRENAMIENTO
          </p>

          <h1>
            Mejora tu técnica.
            <br />
            <span>Domina la pista.</span>
          </h1>

          <p>
            Aprende, practica y desarrolla las habilidades
            necesarias para convertirte en un mejor jugador.
          </p>

        </header>

        <section className="training-grid">

          <article className="training-card">

            <div className="training-number">
              01
            </div>

            <h2>Precisión</h2>

            <p>
              Trabaja tu puntería y aprende a controlar
              la dirección de cada lanzamiento.
            </p>

            <button
              type="button"
              onClick={() => navigate('/practica/precision')}
            >
              Comenzar práctica →
            </button>

          </article>

          <article className="training-card">

            <div className="training-number">
              02
            </div>

            <h2>Velocidad</h2>

            <p>
              Aprende a controlar la velocidad de la bola
              para conseguir lanzamientos más consistentes.
            </p>

            <button
              type="button"
              onClick={() => navigate('/practica/velocidad')}
            >
              Comenzar práctica →
            </button>

          </article>

          <article className="training-card">

            <div className="training-number">
              03
            </div>

            <h2>Spare</h2>

            <p>
              Mejora tus lanzamientos después del primer tiro
              y aumenta tus posibilidades de conseguir un spare.
            </p>

            <button
              type="button"
              onClick={() => navigate('/practica/spare')}
            >
              Comenzar práctica →
            </button>

          </article>

          <article className="training-card">

            <div className="training-number">
              04
            </div>

            <h2>Strike</h2>

            <p>
              Perfecciona tu técnica y aprende a buscar
              lanzamientos más efectivos.
            </p>

            <button
              type="button"
              onClick={() => navigate('/practica/strike')}
            >
              Comenzar práctica →
            </button>

          </article>

        </section>

      </main>

    </div>
  )
}

export default Training