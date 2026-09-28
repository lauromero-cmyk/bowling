import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api, { errorMessage } from '../api/axios'

function Register() {
  const { login } = useUser()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'jugador',
    group: 'general',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.username.length < 3) return setError('El nombre debe tener mínimo 3 caracteres.')
    if (form.password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres.')

    try {
      setLoading(true)
      const { data } = await api.post('/register', form)
      login(data.token, data.user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'No se pudo crear la cuenta.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-tag">BOWLINGPRO</p>
        <h1>Crea tu cuenta.</h1>
        <p className="login-subtitle">Empieza a entrenar como un profesional.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label>
          <input id="username" value={form.username} onChange={change('username')} placeholder="Tu nombre" />

          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" value={form.email} onChange={change('email')} placeholder="correo@ejemplo.com" />

          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" value={form.password} onChange={change('password')} placeholder="Mínimo 6 caracteres" />

          <label htmlFor="role">Soy</label>
          <select id="role" className="auth-select" value={form.role} onChange={change('role')}>
            <option value="jugador">Jugador en formación</option>
            <option value="entrenador">Entrenador</option>
          </select>

          <label htmlFor="group">Grupo o liga</label>
          <input id="group" value={form.group} onChange={change('group')} placeholder="general" />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="main-button login-button" disabled={loading}>
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
