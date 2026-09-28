import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const [showProfileMenu, setShowProfileMenu] = useState(false)

  if (!user) {
    return null
  }

  const handleLogout = () => {
    setShowProfileMenu(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">

      <button
        type="button"
        className="logo"
        onClick={() => navigate('/')}
      >
        <span>Bowling</span>Pro
      </button>

      <div className="nav-links">

        {user.currentPage !== 'home' && (
          <button
            type="button"
            className="nav-button secondary-nav"
            onClick={() => navigate('/')}
          >
            Inicio
          </button>
        )}

        {user.currentPage !== 'home' && (
          <button
            type="button"
            className="nav-button"
            onClick={() => navigate('/tareas')}
          >
            Mis tareas
          </button>
        )}

        <div className="profile-wrapper">

          <button
            type="button"
            className="profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Abrir perfil"
          >
            <div className="profile-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : 'J'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">

              <div className="profile-menu-header">

                <div className="profile-avatar profile-avatar-large">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : 'J'}
                </div>

                <div>
                  <strong>
                    {user.name || 'Jugador'}
                  </strong>

                  <span>
                    {user.email || 'Jugador BowlingPro'}
                  </span>
                </div>

              </div>

              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setShowProfileMenu(false)
                  navigate('/perfil')
                }}
              >
                Mi perfil
              </button>

              <button
                type="button"
                className="profile-menu-item logout-item"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>

            </div>
          )}

        </div>

      </div>

    </nav>
  )
}

export default Navbar