import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

// Barra de navegación común para las secciones de la app
function AppNav() {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const role = user?.profile?.role || 'jugador'
  const name = user?.profile?.username || 'Jugador'

  const links = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/lecciones', label: 'Lecciones' },
    { to: '/partidas', label: 'Partidas' },
    { to: '/entrenamiento', label: 'Entrenamiento' },
    { to: '/retos', label: 'Retos' },
    { to: '/progreso', label: 'Progreso' },
    role === 'jugador'
      ? { to: '/mensajes', label: 'Entrenador' }
      : { to: '/entrenador', label: 'Mis jugadores' },
    { to: '/glosario', label: 'Glosario' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar app-nav">
      <button type="button" className="logo" onClick={() => navigate('/')}>
        <span>Bowling</span>Pro
      </button>

      <div className="nav-links app-nav-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}

        <button
          type="button"
          className="profile-button"
          onClick={() => navigate('/perfil')}
          title={`Perfil de ${name}`}
        >
          {name.charAt(0).toUpperCase()}
        </button>

        <button type="button" className="nav-button logout-link" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </nav>
  )
}

export default AppNav
