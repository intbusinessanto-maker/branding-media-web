import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function Counter({ to, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = to
    const step = 1800 / end
    const timer = setInterval(() => {
      start += Math.ceil(end / 60)
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, step)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const stats = [
  {
    value: 13, suffix: '+',
    label: 'Universidades activas',
    desc: 'Top instituciones de Colombia',
    color: '#00C4AD',
    border: 'rgba(0,196,173,0.2)',
  },
  {
    value: 800, suffix: 'K+',
    label: 'Estudiantes / mes',
    desc: 'Audiencia universitaria premium',
    color: '#F07B00',
    border: 'rgba(240,123,0,0.2)',
  },
  {
    value: 5, suffix: '+',
    label: 'Años de operación',
    desc: 'Experiencia en medios académicos',
    color: '#8B3FA8',
    border: 'rgba(139,63,168,0.2)',
  },
  {
    value: 98, suffix: '%',
    label: 'Satisfacción de marca',
    desc: 'Clientes que renuevan campaña',
    color: '#F07B00',
    border: 'rgba(240,123,0,0.2)',
  },
]

export default function Stats() {
  return (
    <section
      id="nosotros"
      style={{
        padding: '80px 2rem',
        borderTop: '1px solid #1E1E1E',
        borderBottom: '1px solid #1E1E1E',
        backgroundColor: '#0D0D0D',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1px',
          background: '#1E1E1E',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #1E1E1E',
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '40px 32px',
                backgroundColor: '#0A0A0A',
                display: 'flex', flexDirection: 'column', gap: '8px',
                borderBottom: `3px solid ${s.color}`,
              }}
            >
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: s.color,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                textShadow: `0 0 20px ${s.border}`,
              }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{s.label}</div>
              <div style={{ fontSize: '13px', color: '#555' }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
