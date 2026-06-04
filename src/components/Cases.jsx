import { motion } from 'framer-motion'

const cases = [
  {
    sector: 'FMCG',
    tag: 'DOOH · Bogotá',
    headline: 'Incremento del 40% en reconocimiento de marca',
    body: 'Campaña de lanzamiento de producto en 5 campus bogotanos. 8 semanas de pauta con contenido dinámico adaptado por franja horaria.',
    metric1: { label: 'Impactos', value: '1.2M+' },
    metric2: { label: 'Duración', value: '8 sem' },
    color: '#00C4AD',
    border: 'rgba(0,196,173,0.15)',
  },
  {
    sector: 'Fintech',
    tag: 'OOH · Nacional',
    headline: 'Adquisición de usuarios en audiencia 18–25',
    body: 'Despliegue simultáneo en 4 ciudades para app financiera. Combinación de vallas físicas y activaciones de registro en campus.',
    metric1: { label: 'Ciudades', value: '4' },
    metric2: { label: 'Registros', value: '12K+' },
    color: '#F07B00',
    border: 'rgba(240,123,0,0.15)',
  },
  {
    sector: 'Retail',
    tag: 'Activación · Medellín',
    headline: 'Experiencia de marca con 3.000 interacciones directas',
    body: 'Stand de sampling en 2 universidades durante semana de bienvenida. Generación de contenido orgánico y base de datos propia.',
    metric1: { label: 'Interacciones', value: '3K+' },
    metric2: { label: 'UGC posts', value: '800+' },
    color: '#8B3FA8',
    border: 'rgba(139,63,168,0.15)',
  },
]

export default function Cases() {
  return (
    <section
      id="casos"
      style={{ padding: '100px 2rem', backgroundColor: '#0D0D0D' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}
        >
          <div style={{ maxWidth: '500px' }}>
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#F07B00',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'block', marginBottom: '16px',
            }}>
              Resultados
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>
              Casos de{' '}
              <span style={{
                background: 'linear-gradient(90deg, #F07B00, #8B3FA8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>éxito</span>
            </h2>
          </div>
          <p style={{ color: '#555', fontSize: '14px', maxWidth: '300px', lineHeight: 1.7 }}>
            Resultados reales. Marcas protegidas por acuerdo de confidencialidad.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: '32px',
                borderRadius: '16px',
                border: `1px solid ${c.border}`,
                backgroundColor: '#0A0A0A',
                display: 'flex', flexDirection: 'column', gap: '20px',
                boxShadow: `0 0 30px ${c.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: c.color,
                  border: `1px solid ${c.border}`,
                  padding: '4px 12px', borderRadius: '100px',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  {c.sector}
                </span>
                <span style={{ fontSize: '11px', color: '#444' }}>{c.tag}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '10px' }}>
                  {c.headline}
                </h3>
                <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{c.body}</p>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '12px', paddingTop: '20px',
                borderTop: `1px solid ${c.border}`,
              }}>
                {[c.metric1, c.metric2].map(m => (
                  <div key={m.label}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: c.color, letterSpacing: '-0.03em' }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
