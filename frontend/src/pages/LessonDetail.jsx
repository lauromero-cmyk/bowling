import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppNav from '../components/AppNav'
import api, { errorMessage } from '../api/axios'
import { useUser } from '../context/UserContext'

function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, updateProfile } = useUser()

  const [lesson, setLesson] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/lessons/${id}`)
      .then(({ data }) => {
        setLesson(data)
        setAnswers(Array(data.quiz.length).fill(null))
        // Guardar la lección para consultarla sin conexión
        try { localStorage.setItem(`lesson_${id}`, JSON.stringify(data)) } catch { /* sin espacio */ }
      })
      .catch((err) => {
        const cached = localStorage.getItem(`lesson_${id}`)
        if (cached && !err.response) {
          const data = JSON.parse(cached)
          setLesson({ ...data, offline: true })
          setAnswers(Array(data.quiz.length).fill(null))
        } else {
          setError(errorMessage(err, 'No se pudo cargar la lección.'))
        }
      })
  }, [id])

  const submit = async () => {
    if (answers.some((a) => a === null)) {
      setError('Responde todas las preguntas.')
      return
    }
    try {
      setError('')
      const { data } = await api.post(`/lessons/${id}/quiz`, { answers })
      setResult(data)
      if (data.levelUp) {
        updateProfile({ ...user.profile, level: data.level })
      }
    } catch (err) {
      setError(errorMessage(err, 'No se pudo enviar la evaluación.'))
    }
  }

  return (
    <div className="section-page">
      <AppNav />
      <main className="section-container narrow">
        <button type="button" className="back-link" onClick={() => navigate('/lecciones')}>← Volver a lecciones</button>

        {error && <p className="form-error">{error}</p>}

        {lesson && (
          <>
            <header className="section-header">
              <p className="tag">{lesson.level.toUpperCase()}</p>
              <h1>{lesson.title}</h1>
              <p>{lesson.summary}</p>
              {lesson.offline && <p className="pill">Modo sin conexión</p>}
            </header>

            <section className="card">
              <h2>Paso a paso</h2>
              <ol className="steps">
                {lesson.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              {lesson.video && (
                <a className="secondary-button video-link" href={lesson.video} target="_blank" rel="noreferrer">
                  ▶ Ver videos demostrativos
                </a>
              )}
            </section>

            <section className="card">
              <h2>Evaluación</h2>
              {lesson.quiz.map((q, i) => (
                <fieldset key={i} className="quiz-question">
                  <legend>{i + 1}. {q.q}</legend>
                  {q.options.map((o, k) => {
                    const c = result?.corrections?.[i]
                    const state = c ? (k === c.answer ? 'right' : answers[i] === k ? 'wrong' : '') : ''
                    return (
                      <label key={k} className={`quiz-option ${state}`}>
                        <input
                          type="radio"
                          name={`q${i}`}
                          checked={answers[i] === k}
                          disabled={Boolean(result)}
                          onChange={() => setAnswers(answers.map((a, j) => (j === i ? k : a)))}
                        />
                        {o}
                      </label>
                    )
                  })}
                </fieldset>
              ))}

              {!result ? (
                <button type="button" className="main-button" onClick={submit} disabled={lesson.offline}>
                  {lesson.offline ? 'Conéctate para enviar la evaluación' : 'Enviar respuestas'}
                </button>
              ) : (
                <div className={`quiz-result ${result.passed ? 'ok' : 'fail'}`}>
                  <strong>{result.score}%</strong> — {result.correct} de {result.total} correctas.{' '}
                  {result.passed ? '¡Aprobaste!' : `Necesitas ${result.minScore}% para aprobar.`}
                  {result.levelUp && <p>🎉 ¡Subiste al nivel <strong>{result.level}</strong>!</p>}
                  <div className="row-actions">
                    <button type="button" className="secondary-button" onClick={() => { setResult(null); setAnswers(Array(lesson.quiz.length).fill(null)) }}>
                      Intentar de nuevo
                    </button>
                    <button type="button" className="main-button" onClick={() => navigate('/lecciones')}>
                      Ir a lecciones
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default LessonDetail
