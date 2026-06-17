import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const BG_URL  = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico%20y%20maquina%20de%20escribir.webp'
const PNG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico_y_maquina_de_escribir-removebg-preview.png'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

/* ID del video de Vimeo */
const VIMEO_ID = '1202183420'

/* ── MÓVIL — imagen fullscreen con carrusel de pilares encima ── */
function MobileAudience() {
  const [current,  setCurrent]  = useState(0)
  const [autoKey,  setAutoKey]  = useState(0)  // reinicia el timer al hacer swipe
  const touchStartX = useRef(null)

  /* Auto-avance cada 3 s; se reinicia cuando el usuario desliza */
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % pillars.length), 3000)
    return () => clearInterval(t)
  }, [autoKey])

  const goTo = (idx) => {
    setCurrent((idx + pillars.length) % pillars.length)
    setAutoKey(k => k + 1)
  }

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1)
    touchStartX.current = null
  }

  const p = pillars[current]

  return (
    <section id="audiencia" style={{ position: 'relative', height: '100svh', minHeight: '600px', overflow: 'hidden' }}>

      {/* Fondo oscurecido */}
      <img src={BG_URL} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.42)' }} />

      {/* Personas PNG encima del fondo */}
      <img src={PNG_URL} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />

      {/* Degradado para legibilidad del texto abajo */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 28%, rgba(0,0,0,0.92) 68%)' }} />

      {/* Contenido superpuesto */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 1.4rem 2.6rem' }}>

        {/* Encabezado */}
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '6px' }}>
          La audiencia
        </span>
        <h2 style={{ fontSize: 'clamp(1.7rem, 6.5vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '14px' }}>
          ¿Por qué llegar al{' '}<span style={{ color: '#8B3FA8' }}>campus?</span>
        </h2>

        {/* Stat compacto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(232,17,138,0.14)', border: '1px solid rgba(232,17,138,0.22)', marginBottom: '16px' }}>
          <span style={{ fontSize: '32px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>3–6h</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Tiempo en campus</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Promedio diario del estudiante</div>
          </div>
        </div>

        {/* Carrusel — fade entre pilares */}
        <div
          style={{ minHeight: '120px', position: 'relative' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38 }}
              style={{
                display: 'flex', gap: '12px',
                padding: '16px 16px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.60)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid rgba(255,255,255,0.07)`,
                borderLeft: `4px solid ${p.color}`,
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '4px 8px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '2px' }}>
                {p.number}
              </span>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '5px', lineHeight: 1.2 }}>{p.title}</h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores — punto largo para el activo */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '14px' }}>
          {pillars.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: '5px',
                width: i === current ? '22px' : '5px',
                borderRadius: '3px',
                background: i === current ? pillars[current].color : 'rgba(255,255,255,0.25)',
                transition: 'all 0.35s',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── DESKTOP ── */
export default function NewspaperAudience() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const headerOp = useTransform(scrollYProgress, [0.05, 0.20], [0, 1])
  const headerY  = useTransform(scrollYProgress, [0.05, 0.20], [16, 0])

  const p0op = useTransform(scrollYProgress, [0.23, 0.27], [0, 1])
  const p0y  = useTransform(scrollYProgress, [0.23, 0.27], [22, 0])
  const p1op = useTransform(scrollYProgress, [0.35, 0.39], [0, 1])
  const p1y  = useTransform(scrollYProgress, [0.35, 0.39], [22, 0])
  const p2op = useTransform(scrollYProgress, [0.47, 0.51], [0, 1])
  const p2y  = useTransform(scrollYProgress, [0.47, 0.51], [22, 0])
  const p3op = useTransform(scrollYProgress, [0.59, 0.63], [0, 1])
  const p3y  = useTransform(scrollYProgress, [0.59, 0.63], [22, 0])

  const pillarMotions = [
    { op: p0op, y: p0y },
    { op: p1op, y: p1y },
    { op: p2op, y: p2y },
    { op: p3op, y: p3y },
  ]

  if (isMobile) return <MobileAudience />

  return (
    <section ref={ref} id="audiencia" style={{ height: '350vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', willChange: 'transform' }}>

        {/*
         * ── CAPA 0: Video Vimeo como fondo full-cover ──
         * background=1 → autoplay, loop, muted, sin controles.
         * El iframe se escala con max() para cubrir cualquier aspect ratio
         * (equivalente a object-fit: cover).
         */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
          <iframe
            src={`https://player.vimeo.com/video/${VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              /* cover: el mayor de los dos valores cubre siempre el contenedor */
              width:  'max(100vw, 177.78vh)',
              height: 'max(100vh, 56.25vw)',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              pointerEvents: 'none',
            }}
            title="Branding Media background"
          />
        </div>

        {/* ── CAPA 1: oscurecido sobre el video para legibilidad del texto ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.42)' }} />

        {/*
         * Contenido centrado
         * — Ancho reducido a ≤52% para no tapar las personas de los lados
         * — Textos aumentados para mejor legibilidad
         */}
        <div style={{
          position: 'absolute',
          top: '56%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(500px, 52%, 840px)',
          zIndex: 10,
        }}>

          {/* Header + stat */}
          <motion.div style={{ opacity: headerOp, y: headerY }}>
            <div style={{
              padding: '28px 36px 22px', textAlign: 'center',
              background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px 20px 0 0',
              border: '1px solid rgba(255,255,255,0.09)', borderBottom: 'none',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '10px' }}>
                La audiencia
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.4vw, 3.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.06, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
                ¿Por qué llegar al{' '}<span style={{ color: '#8B3FA8' }}>campus?</span>
              </h2>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              padding: '18px 32px',
              background: 'rgba(232,17,138,0.16)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(232,17,138,0.25)',
              borderTop: 'none', borderBottom: 'none',
            }}>
              <span style={{ fontSize: 'clamp(40px, 5.5vw, 62px)', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0, textShadow: '0 0 24px rgba(232,17,138,0.5)' }}>
                3–6h
              </span>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>Tiempo promedio en campus</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Más que en cualquier otro entorno</div>
              </div>
            </div>
          </motion.div>

          {/* Pilares 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                style={{
                  opacity: pillarMotions[i].op,
                  y: pillarMotions[i].y,
                  display: 'flex', gap: '14px',
                  padding: '22px 24px',
                  background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderLeft: `4px solid ${p.color}`,
                  borderTop: i >= 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  borderRadius:
                    i === 2 ? '0 0 0 20px' :
                    i === 3 ? '0 0 20px 0' : '0',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '4px 8px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '3px' }}>
                  {p.number}
                </span>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '6px', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,1)' }}>{p.title}</h4>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
