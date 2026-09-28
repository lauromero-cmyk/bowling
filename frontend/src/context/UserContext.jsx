import {
  createContext,
  useContext,
  useState
} from 'react'

const UserContext = createContext()

const readStoredUser = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    return null
  }

  try {
    const profile = JSON.parse(localStorage.getItem('bowlingpro_profile') || '{}')
    return { token, profile }
  } catch {
    return { token, profile: {} }
  }
}

export function UserProvider({ children }) {

  const [user, setUser] = useState(readStoredUser)

  // Recibe el token y los datos que devuelve el backend en /login o /register
  const login = (token, profile) => {
    localStorage.setItem('token', token)
    localStorage.setItem('bowlingpro_profile', JSON.stringify(profile))
    setUser({ token, profile })
  }

  const updateProfile = (profile) => {
    localStorage.setItem('bowlingpro_profile', JSON.stringify(profile))
    setUser((currentUser) => ({ ...currentUser, profile }))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('bowlingpro_profile')
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
