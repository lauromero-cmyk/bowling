import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api/axios'

// Conversación entre jugador y entrenador. Si se pasa playerId, la ve el entrenador.
function FeedbackThread({ playerId, isCoach = false }) {
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  const [kind, setKind] = useState('mensaje')
  const [error, setError] = useState('')

  const load = () =>
    api.get('/feedback', { params: playerId ? { player: playerId } : {} })
      .then(({ data }) => setItems(data))
      .catch((err) => setError(errorMessage(err, 'No se pudieron cargar los mensajes.')))

  useEffect(() => { load() }, [playerId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      setError('')
      await api.post('/feedback', { text, player: playerId, kind })
      setText('')
      load()
    } catch (err) {
      setError(errorMessage(err, 'No se pudo enviar el mensaje.'))
    }
  }

  const fmt = (d) => new Date(d).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="thread">
      <form onSubmit={send} className="thread-form">
        <textarea
          className="text-input"
          rows="3"
          placeholder={isCoach ? 'Escribe un comentario o recomendación…' : 'Escríbele a tu entrenador…'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="row-actions">
          {isCoach && (
            <select className="text-input small" value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="mensaje">Comentario</option>
              <option value="observacion">Observación de sesión</option>
            </select>
          )}
          <button type="submit" className="main-button">Enviar</button>
        </div>
      </form>

      {error && <p className="form-error">{error}</p>}
      {items.length === 0 && <p className="muted">Aún no hay mensajes.</p>}

      <ul className="messages">
        {items.map((m) => (
          <li key={m._id} className={`message ${m.authorRole !== 'jugador' ? 'from-coach' : ''}`}>
            <div className="message-head">
              <strong>{m.authorName}</strong>
              {m.kind === 'observacion' && <span className="pill">Observación de sesión</span>}
              <small>{fmt(m.createdAt)}</small>
            </div>
            <p>{m.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeedbackThread
