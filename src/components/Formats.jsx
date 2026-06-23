import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { supabase } from '../lib/supabase'

const STATUE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/estatua%20megafono.png'

/* Orden: Activaciones primero → OOH → DOOH */
const formats = [
  {
    tag: 'Experiencial', title: 'Activaciones', subtitle: 'Brand Experience',
    description: 'Intervenciones en vivo: stands, muestras, concursos y experiencias que generan engagement real.',
    features: ['Interacción directa', 'Generación UGC', 'Sampling y demos', 'Medición de engagement'],
    color: '#8B3FA8', bg: 'rgba(139,63,168,0.06)', border: 'rgba(139,63,168,0.15)',
  },
  {
    tag: 'Físico', title: 'OOH', subtitle: 'Out-of-Home',
    description: 'Vallas, backlight, stickers de piso, mupis y activaciones presenciales en universidades.',
    features: ['Presencia permanente en campus', 'Alta recordación de marca', 'Formatos adaptables', 'Impacto visual diferencial'],
    color: '#E8118A', bg: 'rgba(232,17,138,0.06)', border: 'rgba(232,17,138,0.15)',
  },
  {
    tag: 'Digital', title: 'DOOH', subtitle: 'Digital Out-of-Home',
    description: 'Pantallas LED de alta resolución en zonas de alto tráfico dentro de los campus universitarios.',
    features: ['Contenido dinámico en tiempo real', 'Programación por horario', 'Actualización remota', 'Métricas de impacto'],
    color: '#00C4AD', bg: 'rgba(0,196,173,0.06)', border: 'rgba(0,196,173,0.15)',
  },
]

/* ── Popup de ejemplos ── */
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
      className="format-popup-overlay"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <style>{`
        .format-popup-overlay { padding: 0 0 clamp(40px, 8vh, 60px); }
        .format-popup-sheet   { max-height: 78vh; border-radius: 24px; }
        @media (min-width: 768px) {
          .format-popup-overlay { padding: 0; align-items: flex-end; }
          .format-popup-sheet   { max-height: calc(100vh - 68px); border-radius: 24px 24px 0 0; }
        }
      `}</style>
      <motion.div
        initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="format-popup-sheet"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '1100px', background: '#fff', padding: '28px 36px 40px', overflowY: 'auto', boxShadow: '0 -8px 48px rgba(0,0,0,0.20)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: format.color, display: 'block', marginBottom: 4 }}>{format.tag}</span>
            <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.03em', margin: 0 }}>Ejemplos de {format.title}</h3>
          </div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#555', flexShrink: 0 }}>✕</button>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#AAA', padding: '40px 0', fontSize: 14 }}>Cargando ejemplos…</p>
        ) : examples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
            <p style={{ fontSize: 14, color: '#AAA', margin: 0 }}>Próximamente — estamos preparando los ejemplos</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {examples.map(ex => (
              <motion.div key={ex.id} whileHover={{ y: -3 }} onClick={() => setLightbox(ex)}
                style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', background: '#F8F8F8' }}>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#EEE' }}>
                  <img src={ex.image_url} alt={ex.brand_name || ''} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    onError={e => e.target.style.display = 'none'} />
                </div>
                {ex.brand_name && (
                  <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ex.logo_url && <img src={ex.logo_url} alt={ex.brand_name} loading="lazy" style={{ width: 22, height: 22, objectFit: 'contain', background: '#fff', borderRadius: '50%', padding: 2, border: '1px solid #EEE', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{ex.brand_name}</span>
                  </div>
                )}
                {ex.description && <p style={{ fontSize: 11, color: '#888', margin: '0 12px 10px', lineHeight: 1.4 }}>{ex.description}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.img initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
              src={lightbox.image_url} alt="" style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
            <button onClick={() => setLightbox(null)} style={{ all: 'unset', position: 'fixed', top: 20, right: 24, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', backdropFilter: 'blur(8px)' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Sección principal — sticky scroll reveal ── */
export default function Formats() {
  const ref = useRef(null)
  const [activeFormat, setActiveFormat] = useState(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  /* Cada tarjeta ocupa ~1/3 del recorrido y entra desde la izquierda */
  const op0 = useTransform(scrollYProgress, [0.00, 0.07, 0.27, 0.33], [0, 1, 1, 0])
  const x0  = useTransform(scrollYProgress, [0.00, 0.13], [-110, 0])
  const op1 = useTransform(scrollYProgress, [0.33, 0.40, 0.60, 0.66], [0, 1, 1, 0])
  const x1  = useTransform(scrollYProgress, [0.33, 0.46], [-110, 0])
  const op2 = useTransform(scrollYProgress, [0.66, 0.73, 0.93, 1.00], [0, 1, 1, 0])
  const x2  = useTransform(scrollYProgress, [0.66, 0.79], [-110, 0])

  /* Actualiza el indicador activo */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      if (v < 0.33) setActive(0)
      else if (v < 0.66) setActive(1)
      else setActive(2)
    })
    return unsub
  }, [scrollYProgress])

  const layers = [
    { f: formats[0], op: op0, x: x0 },
    { f: formats[1], op: op1, x: x1 },
    { f: formats[2], op: op2, x: x2 },
  ]

  return (
    <div ref={ref} style={{ height: '300vh', position: 'relative' }}>
      <section id="formatos" style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Estatua — izquierda fija */}
        <div style={{ position: 'absolute', bottom: 0, left: 'clamp(-20px, 2vw, 20px)',
          width: 'clamp(160px, 22vw, 340px)', pointerEvents: 'none', zIndex: 0 }}>
          <img src={STATUE_URL} alt="" loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
        </div>

        {/* Header superior */}
        <div style={{ position: 'absolute', top: 'clamp(80px, 12vh, 110px)', left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none', zIndex: 2, padding: '0 1.5rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '10px' }}>
            Formatos
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 900,
            letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, margin: 0 }}>
            Medios que <span style={{ color: '#00C4AD' }}>capturan atención</span>
          </h2>
        </div>

        {/* Tarjetas — una a la vez, entran desde la izquierda */}
        {layers.map(({ f, op, x }, i) => (
          <motion.div
            key={f.title}
            style={{
              position: 'absolute',
              opacity: op, x,
              width: 'min(500px, 88vw)',
              zIndex: 5,
            }}
            onClick={() => setActiveFormat(f)}
          >
            <div style={{
              padding: 'clamp(28px, 4vw, 44px)',
              borderRadius: '20px',
              background: '#fff',
              border: `1px solid ${f.border}`,
              borderLeft: `5px solid ${f.color}`,
              boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: f.color, background: f.bg,
                  border: `1px solid ${f.border}`, padding: '5px 14px', borderRadius: '100px',
                  letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.tag}</span>
                <span style={{ fontSize: '12px', color: f.color, fontWeight: 600 }}>Ver ejemplos →</span>
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: f.color,
                  letterSpacing: '-0.04em', marginBottom: '4px', lineHeight: 1 }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#888', fontWeight: 600, marginBottom: '10px' }}>{f.subtitle}</p>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>{f.description}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {f.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}

        {/* Indicadores de posición — abajo */}
        <div style={{ position: 'absolute', bottom: 'clamp(24px, 4vh, 40px)', left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 8, zIndex: 6, pointerEvents: 'none' }}>
          {formats.map((f, i) => (
            <div key={f.title} style={{
              height: 5, borderRadius: 3, transition: 'all 0.3s',
              width: active === i ? 24 : 5,
              background: active === i ? f.color : 'rgba(0,0,0,0.15)',
            }} />
          ))}
        </div>

      </section>

      {/* Popup */}
      <AnimatePresence>
        {activeFormat && <FormatPopup format={activeFormat} onClose={() => setActiveFormat(null)} />}
      </AnimatePresence>
    </div>
  )
}
