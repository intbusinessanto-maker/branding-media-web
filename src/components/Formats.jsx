import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const STATUE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/estatua%20megafono.png'

const formats = [
  {
    tag: 'Digital', title: 'DOOH', subtitle: 'Digital Out-of-Home',
    description: 'Pantallas LED de alta resolución en zonas de alto tráfico dentro de los campus universitarios.',
    features: ['Contenido dinámico en tiempo real', 'Programación por horario', 'Actualización remota', 'Métricas de impacto'],
    color: '#00C4AD', bg: 'rgba(0,196,173,0.06)', border: 'rgba(0,196,173,0.15)',
  },
  {
    tag: 'Físico', title: 'OOH', subtitle: 'Out-of-Home',
    description: 'Vallas, backlight, stickers de piso, mupis y activaciones presenciales en universidades.',
    features: ['Presencia permanente en campus', 'Alta recordación de marca', 'Formatos adaptables', 'Impacto visual diferencial'],
    color: '#E8118A', bg: 'rgba(232,17,138,0.06)', border: 'rgba(232,17,138,0.15)',
  },
  {
    tag: 'Experiencial', title: 'Activaciones', subtitle: 'Brand Experience',
    description: 'Intervenciones en vivo: stands, muestras, concursos y experiencias que generan engagement real.',
    features: ['Interacción directa', 'Generación UGC', 'Sampling y demos', 'Medición de engagement'],
    color: '#8B3FA8', bg: 'rgba(139,63,168,0.06)', border: 'rgba(139,63,168,0.15)',
  },
]

export default function Formats() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })

  return (
    <section ref={sectionRef} id="formatos" className="formats-section"
      style={{ padding: '100px 2rem', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 640px) {
          .formats-section { padding: 56px 1.25rem 56px !important; }
          .formats-header  { margin-bottom: 28px !important; }
          .formats-grid {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto;
            gap: 14px !important;
            padding-bottom: 16px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .formats-grid::-webkit-scrollbar { display: none; }
          .formats-card {
            flex: 0 0 80vw !important;
            scroll-snap-align: start;
            padding: 24px !important;
            gap: 14px !important;
          }
          .formats-card h3 { font-size: 26px !important; }
        }
      `}</style>
      {/* ── Estatua con megáfono — lado izquierdo, PNG ya sin fondo ── */}
      <motion.div
        initial={{ opacity: 0, x: -40, scale: 0.94 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 'clamp(-30px, 2vw, 20px)',
          width: 'clamp(200px, 30vw, 420px)',
          height: 'auto',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <img
          src={STATUE_URL}
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
        />
      </motion.div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="formats-header" transition={{ duration: 0.7 }} style={{ marginBottom: '56px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Formatos</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1 }}>
            Medios que{' '}
            <span style={{ color: '#00C4AD' }}>capturan atención</span>
          </h2>
        </motion.div>

        <div className="formats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {formats.map((f, i) => (
            <motion.div key={f.title}
              className="formats-card"
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -6, boxShadow: `0 16px 40px rgba(0,0,0,0.10)`, transition: { duration: 0.22 } }}
              style={{
                padding: '36px', borderRadius: '16px', background: '#fff',
                border: `1px solid ${f.border}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: f.color,
                  background: f.bg, border: `1px solid ${f.border}`,
                  padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{f.tag}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '32px', fontWeight: 900, color: f.color, letterSpacing: '-0.03em', marginBottom: '4px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#888', fontWeight: 600, marginBottom: '10px' }}>{f.subtitle}</p>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>{f.description}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {f.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#666' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.color, flexShrink: 0, display: 'inline-block' }} />
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



