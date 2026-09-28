import { useEffect, useState } from 'react'
import AppNav from '../components/AppNav'
import api, { errorMessage } from '../api/axios'

function Glossary() {
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/glossary')
      .then(({ data }) => { setData(data); localStorage.setItem('glossary', JSON.stringify(data)) })
      .catch((err) => {
        const cached = localStorage.getItem('glossary')
        if (cached) setData(JSON.parse(cached))
        else setError(errorMessage(err, 'No se pudo cargar el glosario.'))
      })
  }, [])

  const terms = data?.glossary.filter((t) =>
    `${t.term} ${t.definition}`.toLowerCase().includes(query.toLowerCase())
  ) || []

  return (
    <div className="section-page">
      <AppNav />
      <main className="section-container">
        <header className="section-header">
          <p className="tag">GLOSARIO Y REGLAMENTO</p>
          <h1>Habla como un <span>bolichero.</span></h1>
        </header>

        {error && <p className="form-error">{error}</p>}

        {data && (
          <div className="two-cols">
            <section className="card">
              <h2>Términos clave</h2>
              <input className="text-input" placeholder="Buscar término…" value={query} onChange={(e) => setQuery(e.target.value)} />
              <dl className="glossary">
                {terms.map((t) => (
                  <div key={t.term}>
                    <dt>{t.term}</dt>
                    <dd>{t.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="card">
              <h2>Reglas oficiales (resumen)</h2>
              <ol className="steps">
                {data.rules.map((r, i) => <li key={i}>{r}</li>)}
              </ol>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default Glossary
