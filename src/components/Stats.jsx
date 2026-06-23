import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function Counter({ to, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const timer = setInterval(() => {
      start += Math.ceil(to / 60)
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(start)
    }, 1800 / to)
    return () => clearInterval(timer)
  }, [inView, to])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { value: 15, suffix: '+', label: 'Universidades activas', desc: 'Top instituciones de Colombia', color: '#00C4AD' },
  { value: 8, suffix: 'M+', label: 'Población universidades / mes', desc: 'Audiencia universitaria premium', color: '#E8118A' },
  { value: 4, suffix: '', label: 'Años de operación', desc: 'Experiencia en medios académicos', color: '#8B3FA8' },
  { value: 98, suffix: '%', label: 'Satisfacción de marca', desc: 'Clientes que renuevan campaña', color: '#E8118A' },
]

export default function Stats() {
  return (
    <section id="nosotros" style={{ padding: '80px 2rem', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, boxShadow: `0 12px 32px rgba(0,0,0,0.10)`, transition: { duration: 0.2 } }}
              style={{
                padding: '32px 28px', borderRadius: '16px',
                background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                borderTop: `4px solid ${s.color}`,
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', marginTop: '8px' }}>{s.label}</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


