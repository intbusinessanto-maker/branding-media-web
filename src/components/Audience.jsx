import { motion } from 'framer-motion'

const pillars = [
  {
    number: '01',
    title: 'Audiencia de alto valor',
    body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',
    color: '#00C4AD',
  },
  {
    number: '02',
    title: 'Contexto de concentración',
    body: 'A diferencia del espacio público tradicional, el campus universitario es un entorno donde el estudiante permanece horas, facilitando mayor exposición y recuerdo.',
    color: '#8B3FA8',
  },
  {
    number: '03',
    title: 'Segmentación natural',
    body: 'Cada universidad tiene un perfil socioeconómico y de intereses específico. Tu campaña llega al segmento correcto en el campus correcto.',
    color: '#F07B00',
  },
  {
    number: '04',
    title: 'Baja saturación publicitaria',
    body: 'El entorno universitario tiene significativamente menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',
    color: '#00C4AD',
  },
]

export default function Audience() {
  return (
    <section
      id="audiencia"
      style={{ padding: '100px 2rem', backgroundColor: '#0A0A0A' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#8B3FA8',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'block', marginBottom: '16px',
            }}>
              La audiencia
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px',
            }}>
              ¿Por qué llegar al{' '}
              <span style={{
                background: 'linear-gradient(90deg, #8B3FA8, #00C4AD)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>campus?</span>
            </h2>
            <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
              Colombia tiene más de 2 millones de estudiantes universitarios activos.
              Son jóvenes con ingresos propios o familiares, alta conectividad, y están
              formando sus hábitos de consumo para toda la vida.
            </p>

            {/* Big stat */}
            <div style={{
              padding: '24px 28px',
              border: '1px solid rgba(240,123,0,0.2)',
              borderRadius: '12px',
              backgroundColor: 'rgba(240,123,0,0.04)',
              display: 'inline-block',
              boxShadow: '0 0 30px rgba(240,123,0,0.08)',
            }}>
              <div style={{
                fontSize: '52px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1,
                color: '#F07B00',
                textShadow: '0 0 20px rgba(240,123,0,0.4)',
              }}>
                3–6h
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>
                Tiempo promedio diario del estudiante en campus
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  padding: '20px',
                  borderRadius: '12px',
                  border: `1px solid rgba(${p.color === '#00C4AD' ? '0,196,173' : p.color === '#8B3FA8' ? '139,63,168' : '240,123,0'},0.15)`,
                  backgroundColor: '#0D0D0D',
                }}
              >
                <span style={{
                  fontSize: '11px', fontWeight: 900, color: p.color,
                  flexShrink: 0, marginTop: '2px',
                  background: `linear-gradient(135deg, ${p.color}22, ${p.color}11)`,
                  border: `1px solid ${p.color}33`,
                  padding: '3px 8px', borderRadius: '6px',
                  letterSpacing: '0.05em',
                }}>
                  {p.number}
                </span>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
