import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

/* ── Popup de ejemplos por formato ── */
function FormatPopup({ format, onClose }) {
  const [examples, setExamples] = useState([])
  const [loading, setLoading]   = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    supabase.from('format_examples')
      .select('*').eq('format_type', format.title).order('sort_order').order('created_at')
      .then(({ data }) => { setExamples(data || []); setLoading(false) })
  }, [format.title])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        padding: '0 0 clamp(48px, 10vh, 100px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '900px', maxHeight: '75vh',
          background: '#fff', borderRadius: '24px',
          padding: '28px 28px 36px', overflowY: 'auto',
          boxShadow: '0 -8px 48px rgba(0,0,0,0.20)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: format.color, display: 'block', marginBottom: 4 }}>{format.tag}</span>
            <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, color: '#1A1A1A',
              letterSpacing: '-0.03em', margin: 0 }}>
              Ejemplos de {format.title}
            </h3>
          </div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36,
            borderRadius: '50%', background: '#F0F0F0', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, color: '#555', flexShrink: 0 }}>
            ✕
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#AAA', padding: '40px 0', fontSize: 14 }}>Cargando ejemplos…</p>
        ) : examples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#CCC' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
            <p style={{ fontSize: 14, color: '#AAA', margin: 0 }}>Próximamente — estamos preparando los ejemplos</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {examples.map(ex => (
              <motion.div key={ex.id} whileHover={{ y: -3 }} onClick={() => setLightbox(ex)}
                style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.10)', background: '#F8F8F8' }}>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#EEE' }}>
                  <img src={ex.image_url} alt={ex.brand_name || ''} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    onError={e => e.target.style.display = 'none'} />
                </div>
                {ex.brand_name && (
                  <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ex.logo_url && (
                      <img src={ex.logo_url} alt={ex.brand_name} loading="lazy"
                        style={{ width: 22, height: 22, objectFit: 'contain', background: '#fff',
                          borderRadius: '50%', padding: 2, border: '1px solid #EEE', flexShrink: 0 }}
                        onError={e => e.target.style.display = 'none'} />
                    )}
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{ex.brand_name}</span>
                  </div>
                )}
                {ex.description && (
                  <p style={{ fontSize: 11, color: '#888', margin: '0 12px 10px', lineHeight: 1.4 }}>{ex.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Lightbox imagen grande */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.img
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              src={lightbox.image_url} alt={lightbox.brand_name || ''}
              style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 12,
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)}
              style={{ all: 'unset', position: 'fixed', top: 20, right: 24, width: 40, height: 40,
                borderRadius: '50%', background: 'rgba(255,255,255,0.12)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: '#fff', backdropFilter: 'blur(8px)' }}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Formats() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })
  const [activeFormat, setActiveFormat] = useState(null)

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

      {/* Estatua */}
      <motion.div
        initial={{ opacity: 0, x: -40, scale: 0.94 }}
        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ position: 'absolute', bottom: 0, left: 'clamp(-30px, 2vw, 20px)',
          width: 'clamp(200px, 30vw, 420px)', height: 'auto', pointerEvents: 'none', zIndex: 0 }}
      >
        <img src={STATUE_URL} alt="" loading="lazy"
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
      </motion.div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="formats-header" transition={{ duration: 0.7 }} style={{ marginBottom: '56px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Formatos</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1 }}>
            Medios que{' '}<span style={{ color: '#00C4AD' }}>capturan atención</span>
          </h2>
        </motion.div>

        <div className="formats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {formats.map((f, i) => (
            <motion.div key={f.title}
              className="formats-card"
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              whileHover={{ y: -6, boxShadow: `0 16px 40px rgba(0,0,0,0.10)`, transition: { duration: 0.22 } }}
              onClick={() => setActiveFormat(f)}
              style={{
                padding: '36px', borderRadius: '16px', background: '#fff', cursor: 'pointer',
                border: `1px solid ${f.border}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: f.color, background: f.bg,
                  border: `1px solid ${f.border}`, padding: '4px 12px', borderRadius: '100px',
                  letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.tag}</span>
                <span style={{ fontSize: '11px', color: f.color, fontWeight: 600, opacity: 0.7 }}>Ver ejemplos →</span>
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

      {/* Popup de ejemplos */}
      <AnimatePresence>
        {activeFormat && <FormatPopup format={activeFormat} onClose={() => setActiveFormat(null)} />}
      </AnimatePresence>
    </section>
  )
}
