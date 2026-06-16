import { motion } from 'framer-motion'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor', body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.', color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración', body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.', color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural', body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.', color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.', color: '#00C4AD' },
]

export default function Audience() {
  return (
    <section id="audiencia" style={{ padding: 'clamp(60px, 8vw, 100px) 1.5rem', background: '#fff' }}>
      <style>{`
        .audience-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .audience-pillars { display: flex; flex-direction: column; gap: 12px; }
        @media (max-width: 768px) {
          .audience-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="audience-grid">

          {/* Columna izquierda — texto + stat */}
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>
              La audiencia
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '18px' }}>
              ¿Por qué llegar al{' '}
              <span style={{ color: '#8B3FA8' }}>campus?</span>
            </h2>
            <p style={{ color: '#666', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.8, marginBottom: '28px' }}>
              Colombia tiene más de 2 millones de estudiantes universitarios activos, formando sus hábitos de consumo para toda la vida.
            </p>

            {/* Stat destacado */}
            <div style={{
              padding: '24px 28px',
              border: '1px solid rgba(232,17,138,0.2)',
              borderRadius: '14px',
              background: 'rgba(232,17,138,0.04)',
              display: 'flex', alignItems: 'center', gap: '20px',
            }}>
              <div style={{ fontSize: 'clamp(40px, 8vw, 56px)', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>
                3–6h
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', marginBottom: '2px' }}>Tiempo en campus</div>
                <div style={{ fontSize: '12px', color: '#AAA', lineHeight: 1.5 }}>Promedio diario del estudiante — más que en cualquier otro entorno</div>
              </div>
            </div>
          </motion.div>

          {/* Columna derecha — pilares */}
          <div className="audience-pillars">
            {pillars.map((p, i) => (
              <motion.div key={p.number}
                initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
                style={{
                  display: 'flex', gap: '16px',
                  padding: '18px 20px', borderRadius: '12px',
                  background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)',
                  borderLeft: `3px solid ${p.color}`,
                }}>
                <span style={{
                  fontSize: '11px', fontWeight: 900, color: p.color,
                  background: `${p.color}12`,
                  padding: '3px 8px', borderRadius: '6px',
                  flexShrink: 0, marginTop: '2px', height: 'fit-content',
                }}>{p.number}</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>{p.title}</h4>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
