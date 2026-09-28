import { useEffect, useState } from 'react'
import AppNav from '../components/AppNav'
import { useUser } from '../context/UserContext'
import api, { errorMessage } from '../api/axios'

function Profile() {
  const { user, updateProfile } = useUser()
  const [form, setForm] = useState(user?.profile || {})
  const [stats, setStats] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/profile').then(({ data }) => { setForm(data); updateProfile(data) }).catch(() => {})
    api.get('/games/stats').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setError('')
      const { data } = await api.put('/profile', {
        username: form.username,
        style: form.style,
        group: form.group,
      })
      updateProfile(data)
      setMessage('Perfil actualizado correctamente.')
    } catch (err) {
      setError(errorMessage(err, 'No se pudo guardar.'))
    }
  }

  const name = form.username || 'Jugador'

  return (
    <div className="profile-page">
      <AppNav />

      <main className="profile-container">
        <section className="profile-card">
          <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>

          <p className="tag">PERFIL DEL {form.role === 'entrenador' ? 'ENTRENADOR' : 'JUGADOR'}</p>
          <h1>Mi perfil</h1>

          {stats && form.role === 'jugador' && (
            <div className="profile-stats">
              <div><strong>{form.level}</strong><span>Nivel actual</span></div>
              <div><strong>{stats.gamesPlayed}</strong><span>Partidas</span></div>
              <div><strong>{stats.average}</strong><span>Promedio</span></div>
              <div><strong>{stats.bestScore}</strong><span>Mejor</span></div>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input id="name" type="text" value={form.username || ''} onChange={change('username')} />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input id="email" type="email" value={form.email || ''} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="group">Grupo o liga</label>
                <input id="group" type="text" value={form.group || ''} onChange={change('group')} />
              </div>

              <div className="form-group">
                <label htmlFor="style">Estilo de juego</label>
                <select id="style" value={form.style || 'Derecho'} onChange={change('style')}>
                  <option>Derecho</option>
                  <option>Zurdo</option>
                  <option>Ambidiestro</option>
                </select>
              </div>
            </div>

            <p className="muted">El nivel sube automáticamente al aprobar todas las lecciones de tu nivel.</p>

            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}

            <div className="profile-actions">
              <button type="submit" className="main-button">Guardar cambios</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Profile
