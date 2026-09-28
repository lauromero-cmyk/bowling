// Gráfica de línea simple en SVG (sin librerías externas)
function LineChart({ points, max = 300, label = 'Puntaje' }) {
  if (!points.length) return null

  const W = 640, H = 240, left = 44, right = 16, top = 16, bottom = 36
  const innerW = W - left - right
  const innerH = H - top - bottom
  const top10 = Math.max(...points.map((p) => p.y))
  const yMax = Math.min(max, Math.max(50, Math.ceil(top10 / 50) * 50))
  const x = (i) => left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
  const y = (v) => top + innerH - (v / yMax) * innerH
  const ticks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50)
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)} ${y(p.y)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="line-chart" role="img" aria-label={`${label} por partida`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={left} x2={W - right} y1={y(t)} y2={y(t)} className="chart-grid" />
          <text x={left - 8} y={y(t) + 4} textAnchor="end" className="chart-tick">{t}</text>
        </g>
      ))}
      <path d={path} className="chart-line" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.y)} r="5" className="chart-dot">
            <title>{`${p.label}: ${p.y}`}</title>
          </circle>
          {(points.length <= 12 || i % Math.ceil(points.length / 12) === 0) && (
            <text x={x(i)} y={H - 12} textAnchor="middle" className="chart-tick">{p.label}</text>
          )}
        </g>
      ))}
    </svg>
  )
}

export default LineChart
