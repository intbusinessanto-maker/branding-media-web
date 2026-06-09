import { motion } from 'framer-motion'

const cases = [
  { sector: 'FMCG', tag: 'DOOH · Bogotá', headline: 'Incremento del 40% en reconocimiento de marca', body: 'Campaña de lanzamiento en 5 campus bogotanos. 8 semanas con contenido dinámico adaptado por franja horaria.', metric1: { label: 'Impactos', value: '1.2M+' }, metric2: { label: 'Duración', value: '8 sem' }, color: '#00C4AD', border: 'rgba(0,196,173,0.15)' },
  { sector: 'Fintech', tag: 'OOH · Nacional', headline: 'Adquisición de usuarios en audiencia 18–25', body: 'Despliegue en 4 ciudades para app financiera. Vallas físicas + activaciones de registro en campus.', metric1: { label: 'Ciudades', value: '4' }, metric2: { label: 'Registros', value: '12K+' }, color: '#F07B00', border: 'rgba(240,123,0,0.15)' },
  { sector: 'Retail', tag: 'Activación · Medellín', headline: '3.000 interacciones directas con la marca', body: 'Stand de sampling en 2 universidades durante semana de bienvenida. Generación de contenido orgánico.', metric1: { label: 'Interacciones', value: '3K+' }, metric2: { label: 'UGC posts', value: '800+' }, color: '#8B3FA8', border: 'rgba(139,63,168,0.15)' },
]

export default function Cases() {
  return (
    <section id="casos" style={{ padding: '100px 2rem', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }} style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Resultados</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1 }}>
              Casos de{' '}
              <span style={{ color: '#F07B00' }}>éxito</span>
            </h2>
          </div>
          <p style={{ color: '#AAA', fontSize: '13px', maxWidth: '260px', lineHeight: 1.6 }}>Marcas protegidas por acuerdo de confidencialidad.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {cases.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -5, boxShadow: '0 16px 36px rgba(0,0,0,0.10)', transition: { duration: 0.2 } }}
              style={{
                padding: '32px', borderRadius: '16px', background: '#fff',
                border: `1px solid ${c.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: '18px',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: c.color, border: `1px solid ${c.border}`, padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${c.color}0A` }}>{c.sector}</span>
                <span style={{ fontSize: '11px', color: '#AAA' }}>{c.tag}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.35, marginBottom: '8px' }}>{c.headline}</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>{c.body}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '18px', borderTop: `1px solid ${c.border}` }}>
                {[c.metric1, c.metric2].map(m => (
                  <div key={m.label}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: c.color, letterSpacing: '-0.03em' }}>{m.value}</div>
                    <div style={{ fontSize: '11px', color: '#AAA', marginTop: '2px' }}>{m.label}</div>
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



