import AppNav from '../components/AppNav'
import FeedbackThread from '../components/FeedbackThread'

function Messages() {
  return (
    <div className="section-page">
      <AppNav />
      <main className="section-container narrow">
        <header className="section-header">
          <p className="tag">RETROALIMENTACIÓN</p>
          <h1>Habla con tu <span>entrenador.</span></h1>
          <p>Aquí ves los comentarios, recomendaciones y observaciones de sesión que te deja tu entrenador.</p>
        </header>
        <section className="card">
          <FeedbackThread />
        </section>
      </main>
    </div>
  )
}

export default Messages
