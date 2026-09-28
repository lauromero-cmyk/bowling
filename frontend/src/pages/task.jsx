import { API_URL as BASE_API_URL } from '../api/config'
import AppNav from '../components/AppNav'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Tasks() {
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pendiente'
  })

  // ==========================================
  // URL DEL BACKEND
  // ==========================================

  const API_URL = `${BASE_API_URL}/task`

  // ==========================================
  // HEADERS
  // ==========================================

  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (user?.token) {
      headers.Authorization = `Bearer ${user.token}`
    }

    return headers
  }

  // ==========================================
  // OBTENER TAREAS
  // ==========================================

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: getHeaders()
      })

      if (!response.ok) {
        throw new Error('No se pudieron cargar las tareas.')
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        setTasks(data)
      } else if (Array.isArray(data.tasks)) {
        setTasks(data.tasks)
      } else {
        setTasks([])
      }
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) {
      loadTasks()
    } else {
      setLoading(false)
    }
  }, [user])

  // ==========================================
  // CAMBIAR CAMPOS DEL FORMULARIO
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  // ==========================================
  // ABRIR FORMULARIO PARA CREAR
  // ==========================================

  const openCreateForm = () => {
    setEditingTask(null)

    setForm({
      title: '',
      description: '',
      status: 'Pendiente'
    })

    setError('')
    setShowForm(true)
  }

  // ==========================================
  // ABRIR FORMULARIO PARA EDITAR
  // ==========================================

  const openEditForm = (task) => {
    setEditingTask(task)

    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'Pendiente'
    })

    setError('')
    setShowForm(true)
  }

  // ==========================================
  // CERRAR FORMULARIO
  // ==========================================

  const closeForm = () => {
    setShowForm(false)
    setEditingTask(null)

    setForm({
      title: '',
      description: '',
      status: 'Pendiente'
    })
  }

  // ==========================================
  // CREAR / ACTUALIZAR
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('El título de la tarea es obligatorio.')
      return
    }

    try {
      setError('')

      const url = editingTask
        ? `${API_URL}/${editingTask._id}`
        : API_URL

      const method = editingTask ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status
        })
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.message ||
          (
            editingTask
              ? 'No se pudo actualizar la tarea.'
              : 'No se pudo crear la tarea.'
          )
        )
      }

      closeForm()
      await loadTasks()
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // ==========================================
  // ELIMINAR
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿Seguro que quieres eliminar esta tarea?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.message || 'No se pudo eliminar la tarea.'
        )
      }

      await loadTasks()
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="tasks-page">

      {/* NAVBAR */}

      <AppNav />

      {/* CONTENIDO */}

      <main className="tasks-container">

        <header className="tasks-header">

          <p className="tag">
            BOWLINGPRO
          </p>

          <h1>
            Mis tareas.
          </h1>

          <p>
            Organiza y administra tus actividades de entrenamiento.
          </p>

        </header>

        {/* BARRA DE ACCIONES */}

        <div className="tasks-toolbar">

          <button
            type="button"
            className="main-button"
            onClick={openCreateForm}
          >
            + Nueva tarea
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="task-error">
            {error}
          </div>
        )}

        {/* FORMULARIO */}

        {showForm && (
          <section className="task-form-card">

            <div className="task-form-header">

              <div>
                <p className="tag">
                  {editingTask ? 'EDITAR' : 'NUEVA TAREA'}
                </p>

                <h2>
                  {editingTask
                    ? 'Actualizar tarea'
                    : 'Crear nueva tarea'}
                </h2>
              </div>

              <button
                type="button"
                className="close-form-button"
                onClick={closeForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="task-form-group">

                <label htmlFor="title">
                  Título
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ej. Practicar precisión"
                  value={form.title}
                  onChange={handleChange}
                />

              </div>

              <div className="task-form-group">

                <label htmlFor="description">
                  Descripción
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe la actividad..."
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                />

              </div>

              <div className="task-form-group">

                <label htmlFor="status">
                  Estado
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Pendiente">
                    Pendiente
                  </option>

                  <option value="En progreso">
                    En progreso
                  </option>

                  <option value="Completada">
                    Completada
                  </option>
                </select>

              </div>

              <div className="task-form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="main-button"
                >
                  {editingTask
                    ? 'Guardar cambios'
                    : 'Crear tarea'}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* LISTA DE TAREAS */}

        <section className="tasks-list">

          {loading ? (

            <div className="empty-tasks">
              <p className="loading-message">
                Cargando tareas...
              </p>
            </div>

          ) : tasks.length === 0 ? (

            <div className="empty-tasks">

              <div className="empty-icon">
                ✓
              </div>

              <h2>
                No tienes tareas todavía.
              </h2>

              <p>
                Crea tu primera tarea para organizar
                tu entrenamiento.
              </p>

              <button
                type="button"
                className="main-button"
                onClick={openCreateForm}
              >
                Crear mi primera tarea
              </button>

            </div>

          ) : (

            <>

              <div className="tasks-count">

                <span>
                  Tus tareas
                </span>

                <strong>
                  {tasks.length}
                </strong>

              </div>

              <div className="task-grid">

                {tasks.map((task) => (

                  <article
                    className="task-card"
                    key={task._id}
                  >

                    <div className="task-card-content">

                      <span
                        className={`task-status ${
                          task.status === 'Completada'
                            ? 'completed'
                            : task.status === 'En progreso'
                              ? 'progress'
                              : ''
                        }`}
                      >
                        {task.status || 'Pendiente'}
                      </span>

                      <h2>
                        {task.title}
                      </h2>

                      <p>
                        {task.description ||
                          'Sin descripción.'}
                      </p>

                    </div>

                    <div className="task-card-actions">

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => openEditForm(task)}
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

            </>

          )}

        </section>

      </main>

    </div>
  )
}

export default Tasks