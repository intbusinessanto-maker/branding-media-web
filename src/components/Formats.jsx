import { motion } from 'framer-motion'

const formats = [
  {
    tag: 'Digital',
    title: 'DOOH',
    subtitle: 'Digital Out-of-Home',
    description: 'Pantallas LED de alta resolución estratégicamente ubicadas en zonas de alto tráfico dentro de los campus universitarios.',
    features: ['Contenido dinámico en tiempo real', 'Programación por horario y audiencia', 'Actualización remota inmediata', 'Métricas de impacto digital'],
    color: '#00C4AD',
    glow: 'rgba(0,196,173,0.12)',
    border: 'rgba(0,196,173,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="2" stroke="#00C4AD" strokeWidth="1.5"/>
        <path d="M12 24v2M20 24v2M10 26h12" stroke="#00C4AD" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="8" y="12" width="16" height="8" rx="1" fill="rgba(0,196,173,0.1)" stroke="#00C4AD" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    tag: 'Físico',
    title: 'OOH',
    subtitle: 'Out-of-Home',
    description: 'Espacios físicos de alta visibilidad: vallas, backlight, stickers de piso, mupis y activaciones presenciales en universidades.',
    features: ['Presencia permanente en campus', 'Alta recordación de marca', 'Formatos adaptables', 'Impacto visual diferencial'],
    color: '#F07B00',
    glow: 'rgba(240,123,0,0.12)',
    border: 'rgba(240,123,0,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="14" rx="2" stroke="#F07B00" strokeWidth="1.5"/>
        <path d="M16 20v6" stroke="#F07B00" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 26h12" stroke="#F07B00" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="10" y="10" width="12" height="6" rx="1" fill="rgba(240,123,0,0.1)" stroke="#F07B00" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    tag: 'Experiencial',
    title: 'Activaciones',
    subtitle: 'Brand Experience',
    description: 'Intervenciones de marca en vivo dentro de los campus: stands, muestras, concursos y experiencias que generan engagement real.',
    features: ['Interacción directa con estudiantes', 'Generación de contenido UGC', 'Sampling y demostraciones', 'Medición de engagement'],
    color: '#8B3FA8',
    glow: 'rgba(139,63,168,0.12)',
    border: 'rgba(139,63,168,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="14" r="6" stroke="#8B3FA8" strokeWidth="1.5"/>
        <path d="M16 8V6M16 22v2M8 14H6M26 14h-2" stroke="#8B3FA8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10.34 10.34L8.93 8.93M21.66 21.66l-1.41-1.41M21.66 10.34l1.41-1.41M10.34 21.66l-1.41 1.41" stroke="#8B3FA8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Formats() {
  return (
    <section
      id="formatos"
      style={{ padding: '100px 2rem', backgroundColor: '#0D0D0D' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px', maxWidth: '600px' }}
        >
          <span style={{
            fontSize: '12px', fontWeight: 600,
            background: 'linear-gradient(90deg, #8B3FA8, #00C4AD)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            display: 'block', marginBottom: '16px',
          }}>
            Formatos
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px',
          }}>
            Medios que{' '}
            <span style={{
              background: 'linear-gradient(90deg, #00C4AD, #F07B00)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              capturan atención
            </span>
          </h2>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.7 }}>
            Desde pantallas digitales hasta activaciones presenciales,
            ofrecemos los formatos más efectivos para cada tipo de campaña.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {formats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                padding: '36px',
                borderRadius: '16px',
                border: `1px solid ${f.border}`,
                backgroundColor: '#0A0A0A',
                display: 'flex', flexDirection: 'column', gap: '20px',
                boxShadow: `0 0 40px ${f.glow}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: f.glow,
                  border: `1px solid ${f.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {f.icon}
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: f.color,
                  border: `1px solid ${f.border}`,
                  padding: '4px 10px', borderRadius: '100px',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  {f.tag}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em', color: f.color, marginBottom: '4px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#555', marginBottom: '12px', fontWeight: 600 }}>{f.subtitle}</p>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7 }}>{f.description}</p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {f.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#666' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke={f.color} strokeWidth="1"/>
                      <path d="M4.5 7l2 2 3-3" stroke={f.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
