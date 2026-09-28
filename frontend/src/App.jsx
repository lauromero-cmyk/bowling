import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'

import ProtectedRoute from './pages/ProtectedRoute'
import Home from './pages/Home'
import Training from './pages/Training'
import Practice from './pages/Practice'
import Progress from './pages/Progress'
import Tasks from './pages/task'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Games from './pages/Games'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import Challenges from './pages/Challenges'
import Glossary from './pages/Glossary'
import Messages from './pages/Messages'
import Coach from './pages/Coach'

const privateRoutes = [
  ['/', <Home />],
  ['/lecciones', <Lessons />],
  ['/lecciones/:id', <LessonDetail />],
  ['/partidas', <Games />],
  ['/entrenamiento', <Training />],
  ['/practica/:type', <Practice />],
  ['/progreso', <Progress />],
  ['/retos', <Challenges />],
  ['/glosario', <Glossary />],
  ['/mensajes', <Messages />],
  ['/entrenador', <Coach />],
  ['/tareas', <Tasks />],
  ['/perfil', <Profile />],
]

function App() {
  const { user } = useUser()

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/registro" element={user ? <Navigate to="/" replace /> : <Register />} />

        {privateRoutes.map(([path, element]) => (
          <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
        ))}

        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
