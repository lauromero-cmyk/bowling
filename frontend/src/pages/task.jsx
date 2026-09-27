import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useUser } from '../context/UserContext'

function Tasks() {
  const navigate = useNavigate()
  const { logout, user } = useUser()

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/api/task', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setTasks(response.data)
    } catch (error) {
      console.error('ERROR TASKS:', error)

      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('No se pudieron cargar las tareas')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      loadTasks()
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }

    try {
      setError('')

      if (editingTask) {
        const response = await api.put(
          `/api/task/${editingTask._id}`,
          {
            title,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === editingTask._id
              ? response.data
              : task
          )
        )

        setEditingTask(null)
      } else {
        const response = await api.post(
          '/api/task',
          {
            title,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        setTasks((currentTasks) => [
          ...currentTasks,
          response.data,
        ])
      }

      setTitle('')
      setDescription('')
    } catch (error) {
      console.error('ERROR TASK:', error)

      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('No se pudo guardar la tarea')
      }
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description || '')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setTitle('')
    setDescription('')
    setError('')
  }

  const handleDelete = async (id) => {
    try {
      setError('')

      await api.delete(`/api/task/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id)
      )
    } catch (error) {
      console.error('ERROR DELETE TASK:', error)

      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('No se pudo eliminar la tarea')
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="task-page">

      <nav className="navbar">

        <div className="logo">
          <span>Bowling</span>Pro
        </div>

        <div className="nav-links">

          <button
            type="button"
            className="nav-button"
            onClick={() => navigate('/')}
          >
            Inicio
          </button>

          <button
            type="button"
            className="nav-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>

      </nav>

      <main className="task-container">

        <div className="task-header">

          <div>

            <p className="tag">
              BOWLINGPRO
            </p>

            <h1>
              Mis tareas
            </h1>

            <p>
              Gestiona tus actividades de entrenamiento.
            </p>

          </div>

        </div>

        <section className="task-form-card">

          <h2>
            {editingTask ? 'Editar tarea' : 'Nueva tarea'}
          </h2>

          <form onSubmit={handleSubmit}>

            <label>
              Título
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Ej. Practicar lanzamiento recto"
            />

            <label>
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe la actividad"
              rows="4"
            />

            <div className="task-form-buttons">

              <button
                type="submit"
                className="main-button"
              >
                {editingTask
                  ? 'Actualizar tarea'
                  : 'Crear tarea'}
              </button>

              {editingTask && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}

            </div>

          </form>

        </section>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <section className="task-list">

          <div className="task-list-header">

            <h2>
              Mis actividades
            </h2>

            <span>
              {tasks.length} tarea{tasks.length !== 1 ? 's' : ''}
            </span>

          </div>

          {loading ? (
            <p>
              Cargando tareas...
            </p>
          ) : tasks.length === 0 ? (
            <div className="empty-task">

              <h3>
                Aún no tienes tareas
              </h3>

              <p>
                Crea tu primera actividad de entrenamiento.
              </p>

            </div>
          ) : (
            <div className="cards">

              {tasks.map((task) => (

                <article
                  className="card task-card"
                  key={task._id}
                >

                  <div className="task-card-content">

                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {task.description || 'Sin descripción'}
                    </p>

                  </div>

                  <div className="task-actions">

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(task)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(task._id)}
                    >
                      Eliminar
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  )
}

export default Tasks