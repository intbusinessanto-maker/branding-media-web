import { motion } from 'framer-motion'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor', body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.', color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración', body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.', color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural', body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.', color: '#F07B00' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.', color: '#00C4AD' },
]

export default function Audience() {
  return (
    <section id="audiencia" style={{ padding: '100px 2rem', background: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>La audiencia</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '20px' }}>
              ¿Por qué llegar al{' '}
              <span style={{ color: '#8B3FA8' }}>campus?</span>
            </h2>
            <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>
              Colombia tiene más de 2 millones de estudiantes universitarios activos, formando sus hábitos de consumo para toda la vida.
            </p>
            <div style={{ padding: '24px 28px', border: '1px solid rgba(240,123,0,0.2)', borderRadius: '12px', background: 'rgba(240,123,0,0.04)', display: 'inline-block' }}>
              <div style={{ fontSize: '52px', fontWeight: 900, color: '#F07B00', letterSpacing: '-0.04em', lineHeight: 1 }}>3–6h</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Tiempo promedio diario del estudiante en campus</div>
            </div>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pillars.map((p, i) => (
              <motion.div key={p.number}
                initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
                style={{ display: 'flex', gap: '16px', padding: '18px 20px', borderRadius: '12px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 900, color: p.color,
                  background: `${p.color}12`, border: `1px solid ${p.color}25`,
                  padding: '3px 8px', borderRadius: '6px', flexShrink: 0, marginTop: '2px', height: 'fit-content',
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



