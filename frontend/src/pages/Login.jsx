import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api, { errorMessage } from '../api/axios'

function Login() {

  const { login } = useUser()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')

    if (!email || !password) {
      setError('Completa todos los campos.')
      return
    }

    try {
      setLoading(true)
      const { data } = await api.post('/login', { email, password })
      login(data.token, data.user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <p className="login-tag">
          BOWLINGPRO
        </p>

        <h1>
          Bienvenido.
        </h1>

        <p className="login-subtitle">
          Entra a tu espacio de entrenamiento.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="main-button login-button"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>

        </form>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>

      </div>

    </div>
  )
}

export default Login
