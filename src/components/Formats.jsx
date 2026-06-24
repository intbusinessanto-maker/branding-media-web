import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { supabase } from '../lib/supabase'

const STATUE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/estatua%20megafono.png'

/* Orden de aparición: DOOH (1°) → OOH (2°) → Activaciones (3°, derecha) */
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

/* ── Popup ── */
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="format-popup-overlay"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <style>{`
        .format-popup-overlay { padding: 0 0 clamp(40px,8vh,60px); }
        .format-popup-sheet   { max-height: 78vh; border-radius: 24px; }
        @media (min-width: 768px) {
          .format-popup-overlay { padding: 0; }
          .format-popup-sheet   { max-height: calc(100vh - 68px); border-radius: 24px 24px 0 0; }
        }
      `}</style>
      <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="format-popup-sheet"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '1100px', background: '#fff', padding: '28px 36px 40px', overflowY: 'auto', boxShadow: '0 -8px 48px rgba(0,0,0,0.20)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: format.color, display: 'block', marginBottom: 4 }}>{format.tag}</span>
            <h3 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.03em', margin: 0 }}>Ejemplos de {format.title}</h3>
          </div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#555', flexShrink: 0 }}>✕</button>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#AAA', padding: '40px 0', fontSize: 14 }}>Cargando…</p>
        ) : examples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
            <p style={{ fontSize: 14, color: '#AAA', margin: 0 }}>Próximamente</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
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
            <button onClick={() => setLightbox(null)} style={{ all: 'unset', position: 'fixed', top: 20, right: 24, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Sección principal ── */
export default function Formats() {
  const ref = useRef(null)
  const [activeFormat, setActiveFormat] = useState(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /*
   * Desktop: cards entran en los primeros 50% del scroll → quedan visibles 250vh
   * Sección = 500vh → las 3 tarjetas se mantienen visibles el resto del scroll
   * sin que el sticky se libere pronto.
   */
  const op0 = useTransform(scrollYProgress, [0.00, 0.10], [0, 1])
  const x0  = useTransform(scrollYProgress, [0.00, 0.16], [-280, 0])
  const op1 = useTransform(scrollYProgress, [0.20, 0.30], [0, 1])
  const x1  = useTransform(scrollYProgress, [0.20, 0.36], [-380, 0])
  const op2 = useTransform(scrollYProgress, [0.40, 0.50], [0, 1])
  const x2  = useTransform(scrollYProgress, [0.40, 0.56], [-480, 0])

  /*
   * ── MÓVIL: CARRUSEL — solo un card visible a la vez ──
   * Entrada: "desdoblar" desde el megáfono (scaleX 0→1, origin=left)
   * Salida al bajar: x desliza a la derecha (0→110%)
   * Card 3 (DOOH) no sale al bajar, sí se dobla al subir
   * Al subir todo es en reversa automáticamente (transforms bidireccionales)
   */

  /*
   * Móvil: carrusel ajustado a 500vh.
   * Cada card ocupa ~15% del scroll, luego sale. Card3 se queda el resto.
   * Queda 43% de scroll (215vh) con DOOH visible y sin que el sticky se libere.
   */
  // Card 1 — Activaciones (scaleX parte en 0, no en 0.03, para evitar rendija visible)
  const mSX0    = useTransform(scrollYProgress, [0.00, 0.10], [0, 1])
  const mX0_out = useTransform(scrollYProgress, [0.19, 0.25], ['0%', '114%'])
  const mOp0    = useTransform(scrollYProgress, [0.00, 0.07, 0.19, 0.25], [0, 1, 1, 0])

  // Card 2 — OOH
  const mSX1    = useTransform(scrollYProgress, [0.26, 0.35], [0, 1])
  const mX1_out = useTransform(scrollYProgress, [0.44, 0.50], ['0%', '114%'])
  const mOp1    = useTransform(scrollYProgress, [0.26, 0.33, 0.44, 0.50], [0, 1, 1, 0])

  // Card 3 — DOOH (se queda hasta el final)
  const mSX2 = useTransform(scrollYProgress, [0.52, 0.62], [0, 1])
  const mOp2 = useTransform(scrollYProgress, [0.52, 0.59], [0, 1])

  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      if (v >= 0.52) setVisibleCount(3)
      else if (v >= 0.26) setVisibleCount(2)
      else if (v >= 0.04) setVisibleCount(1)
      else setVisibleCount(0)
    })
    return unsub
  }, [scrollYProgress])

  const desktopLayers = [
    { f: formats[0], op: op0, x: x0 },
    { f: formats[1], op: op1, x: x1 },
    { f: formats[2], op: op2, x: x2 },
  ]
  const mobileLayers = [
    { f: formats[0], scaleX: mSX0, xOut: mX0_out, op: mOp0 },
    { f: formats[1], scaleX: mSX1, xOut: mX1_out, op: mOp1 },
    { f: formats[2], scaleX: mSX2, xOut: null,     op: mOp2 },
  ]

  const cardStyle = (f) => ({
    padding: isMobile ? '14px 16px' : 'clamp(18px,2.2vw,28px)',
    borderRadius: '14px',
    background: '#fff',
    border: `1px solid ${f.border}`,
    borderLeft: `4px solid ${f.color}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: '10px',
    height: '100%',
  })

  return (
    /* 500vh: cards entran en los primeros 250vh, luego 250vh de reposo con las 3 visibles */
    <div ref={ref} style={{ height: '500vh', position: 'relative' }}>
      <section id="formatos" style={{
        position: 'sticky', top: 0, height: '100svh',
        overflow: 'hidden', background: 'transparent',
      }}>

        {/*
         * Estatua: en mobile ocupa la izquierda y queda ENCIMA de los cards (zIndex 5).
         * Los cards empiezan en 34vw (solapamiento) para que la estatua los tape por la izq.
         * Efecto: la estatua aparece "delante" de los bloques, como si los anunciara.
         */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: isMobile ? '50vw' : 'clamp(220px, 30vw, 440px)',
          height: isMobile ? '82%' : '92%',
          pointerEvents: 'none', zIndex: isMobile ? 5 : 1,
        }}>
          <img src={STATUE_URL} alt="" loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom left', display: 'block' }} />
        </div>

        {/* ── Header: encima de todo (estatua Y bloques) ── */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '6px' : 'clamp(80px,11vh,100px)',
          left: 0, right: 0,
          textAlign: isMobile ? 'center' : 'center',
          pointerEvents: 'none', zIndex: 6,
          padding: isMobile ? '0 8px' : '0 1rem',
        }}>
          <span style={{ fontSize: isMobile ? '8px' : '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: isMobile ? 3 : 10 }}>
            Formatos
          </span>
          <h2 style={{ fontSize: isMobile ? 'clamp(1rem,4.5vw,1.35rem)' : 'clamp(1.6rem,3.2vw,2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, margin: 0 }}>
            Medios que <span style={{ color: '#00C4AD' }}>capturan atención</span>
          </h2>
        </div>

        {/* ── DESKTOP: 3 tarjetas en fila, flotan desde la estatua ── */}
        {!isMobile && (
        <div style={{
          position: 'absolute',
          left: 'clamp(200px, 28vw, 400px)',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(10px, 1.4vw, 18px)',
          zIndex: 2,
        }}>
          {desktopLayers.map(({ f, op, x }) => (
            <motion.div key={f.title} style={{ opacity: op, x }} onClick={() => setActiveFormat(f)}>
              <div style={cardStyle(f)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: f.color, background: f.bg, border: `1px solid ${f.border}`, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.tag}</span>
                  <span style={{ fontSize: '11px', color: f.color, fontWeight: 600 }}>Ver →</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, color: f.color, letterSpacing: '-0.04em', marginBottom: '3px', lineHeight: 1 }}>{f.title}</h3>
                  <p style={{ fontSize: '11px', color: '#888', fontWeight: 600, marginBottom: '6px' }}>{f.subtitle}</p>
                  <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>{f.description}</p>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '5px', marginTop: 'auto' }}>
                  {f.features.map(feat => (
                    <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '11px', color: '#666' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: f.color, flexShrink: 0, marginTop: '4px' }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* ── MÓVIL: CARRUSEL — tarjetas rectangulares estilo blog, desdoble desde megáfono ── */}
        {isMobile && (
          <div style={{
            position: 'absolute',
            /*
             * Estatua = 50vw, 82% tall → tope en top=18%.
             * Cards empiezan en left=34vw (16vw solapados bajo la estatua) para que
             * la estatua quede visualmente DELANTE de los bloques.
             * top=18% alinea el inicio del card con el tope de la estatua.
             */
            top: '18%',
            bottom: '44px',
            left: '34vw',
            right: '6px',
            overflow: 'hidden',
            zIndex: 2,
          }}>
            {mobileLayers.map(({ f, scaleX, xOut, op }) => (
              <motion.div
                key={f.title}
                style={{
                  position: 'absolute', inset: 0,
                  scaleX,
                  x: xOut ?? '0%',
                  opacity: op,
                  transformOrigin: 'left center',
                }}
                onClick={() => setActiveFormat(f)}
              >
                {/* Tarjeta con proporción rectangular fija, como las del Blog */}
                <div style={{
                  width: '100%',
                  padding: '20px 18px',
                  boxSizing: 'border-box',
                  borderRadius: '16px',
                  background: '#fff',
                  border: `1px solid ${f.border}`,
                  borderTop: `4px solid ${f.color}`,
                  boxShadow: '0 6px 28px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: '10px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: f.color, background: f.bg,
                      border: `1px solid ${f.border}`, padding: '3px 10px', borderRadius: '100px',
                      letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.tag}</span>
                    <span style={{ fontSize: '10px', color: f.color, fontWeight: 700 }}>Ver ejemplos →</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'clamp(1.6rem, 6.5vw, 2.2rem)', fontWeight: 900, color: f.color,
                      letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 5px' }}>{f.title}</h3>
                    <p style={{ fontSize: '11px', color: '#888', fontWeight: 600, margin: '0 0 8px' }}>{f.subtitle}</p>
                    <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6, margin: 0 }}>{f.description}</p>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    {f.features.map(feat => (
                      <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '10px', color: '#666' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: f.color, flexShrink: 0, marginTop: '4px' }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Barra de progreso: alineada con el card, a la derecha de la estatua ── */}
        {isMobile && visibleCount > 0 && (
          <div style={{
            position: 'absolute', bottom: '14px',
            left: '34vw', right: '6px',
            display: 'flex', gap: 5, zIndex: 4, pointerEvents: 'none',
          }}>
            {formats.map((f, i) => (
              <div key={f.title} style={{
                flex: 1, height: 4, borderRadius: 2, transition: 'background 0.4s',
                background: visibleCount > i ? f.color : 'rgba(0,0,0,0.12)',
              }} />
            ))}
          </div>
        )}

        {/* ── Desktop dots ── */}
        {!isMobile && (
          <div style={{ position: 'absolute', bottom: 'clamp(20px,3.5vh,36px)', left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 8, zIndex: 4, pointerEvents: 'none' }}>
            {formats.map((f, i) => (
              <div key={f.title} style={{ height: 5, borderRadius: 3, transition: 'all 0.3s',
                width: visibleCount > i ? 22 : 5,
                background: visibleCount > i ? f.color : 'rgba(0,0,0,0.12)' }} />
            ))}
          </div>
        )}

      </section>

      <AnimatePresence>
        {activeFormat && <FormatPopup format={activeFormat} onClose={() => setActiveFormat(null)} />}
      </AnimatePresence>
    </div>
  )
}
