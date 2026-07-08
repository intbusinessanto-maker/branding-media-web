import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const MOBILE_IMG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/vista%20celuar.png'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

const VIMEO_ID   = '1204915287'
const VIMEO_HASH = 'e67a7306af'

function MobileAudience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const maxProgress = useMotionValue(0)
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      if (v > maxProgress.get()) maxProgress.set(v)
    })
  }, [scrollYProgress, maxProgress])

  // Pilar 01 aparece inmediatamente
  const op0 = useTransform(maxProgress, [0.00, 0.12], [0, 1])
  const y0  = useTransform(maxProgress, [0.00, 0.18], [120, 0])
  // Pilares 02-04: escalonados
  const op1 = useTransform(maxProgress, [0.30, 0.42], [0, 1])
  const y1  = useTransform(maxProgress, [0.30, 0.44], [40, 0])
  const op2 = useTransform(maxProgress, [0.54, 0.64], [0, 1])
  const y2  = useTransform(maxProgress, [0.54, 0.66], [40, 0])
  const op3 = useTransform(maxProgress, [0.76, 0.86], [0, 1])
  const y3  = useTransform(maxProgress, [0.76, 0.88], [40, 0])

  const pillarMotions = [
    { op: op0, y: y0 },
    { op: op1, y: y1 },
    { op: op2, y: y2 },
    { op: op3, y: y3 },
  ]

  return (
    <div ref={ref} style={{ height: '250vh', position: 'relative' }}>
      <section
        id="audiencia"
        style={{
          position: 'sticky', top: 0, height: '100dvh',
          overflow: 'hidden', background: '#0D0D0D',
          touchAction: 'pan-y',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Fondo */}
        <img src={MOBILE_IMG_URL} alt="" loading="eager" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        {/* Degradado — más oscuro para mejor contraste de textos */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.97) 100%)' }} />

        {/* Encabezado — siempre visible desde que entra la sección */}
        <div style={{
          padding: 'calc(65px + 0.8rem) 1.4rem 0.8rem',
          flexShrink: 0, position: 'relative', zIndex: 5,
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '6px' }}>
            La audiencia
          </span>
          <h2 style={{ fontSize: 'clamp(1.45rem, 5.5vw, 2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '10px' }}>
            ¿Por qué llegar a la{' '}<span style={{ color: '#8B3FA8' }}>universidad?</span>
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '7px 13px', borderRadius: '10px', background: 'rgba(232,17,138,0.14)', border: '1px solid rgba(232,17,138,0.22)' }}>
            <span style={{ fontSize: '26px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1 }}>3–6h</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Tiempo en campus</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Promedio diario del estudiante</div>
            </div>
          </div>
        </div>

        {/* Pilares en orden normal (01→04), apilados hacia abajo desde el header */}
        <div style={{
          flex: 1, overflow: 'hidden',
          padding: '0.5rem 1.4rem 1.2rem',
          position: 'relative', zIndex: 5,
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {pillars.map((p, i) => (
            <motion.div
              key={p.number}
              style={{ opacity: pillarMotions[i].op, y: pillarMotions[i].y }}
            >
              <div style={{
                display: 'flex', gap: '12px', padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `4px solid ${p.color}`,
              }}>
                <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '3px 7px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '2px' }}>
                  {p.number}
                </span>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}>{p.title}</h4>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.5, margin: 0 }}>{p.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>
    </div>
  )
}

/* ── DESKTOP ── */
export default function NewspaperAudience() {
  const isMobile = useIsMobile()
  const [showVideo, setShowVideo] = useState(false)

  const ref = useRef(null)

  /* Cargar iframe Vimeo cuando la sección está a punto de entrar —
     rootMargin grande para que el video ya esté listo cuando el usuario llega */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShowVideo(true); observer.disconnect() } },
      { rootMargin: '600px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const headerOp = useTransform(scrollYProgress, [0.04, 0.16], [0, 1])
  const headerY  = useTransform(scrollYProgress, [0.04, 0.16], [16, 0])

  const p0op = useTransform(scrollYProgress, [0.18, 0.26], [0, 1])
  const p0y  = useTransform(scrollYProgress, [0.18, 0.26], [22, 0])
  const p1op = useTransform(scrollYProgress, [0.36, 0.44], [0, 1])
  const p1y  = useTransform(scrollYProgress, [0.36, 0.44], [22, 0])
  const p2op = useTransform(scrollYProgress, [0.54, 0.62], [0, 1])
  const p2y  = useTransform(scrollYProgress, [0.54, 0.62], [22, 0])
  const p3op = useTransform(scrollYProgress, [0.72, 0.80], [0, 1])
  const p3y  = useTransform(scrollYProgress, [0.72, 0.80], [22, 0])

  const pillarMotions = [
    { op: p0op, y: p0y },
    { op: p1op, y: p1y },
    { op: p2op, y: p2y },
    { op: p3op, y: p3y },
  ]

  if (isMobile) return <MobileAudience />

  return (
    <section ref={ref} id="audiencia" style={{ height: '200vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', willChange: 'transform', background: '#0D0D0D' }}>

        {/*
         * ── CAPA 0: Video Vimeo como fondo full-cover ──
         * background=1 → autoplay, loop, muted, sin controles.
         * El iframe se escala con max() para cubrir cualquier aspect ratio
         * (equivalente a object-fit: cover).
         */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
          {showVideo && <iframe
            src={`https://player.vimeo.com/video/${VIMEO_ID}?h=${VIMEO_HASH}&background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width:  'max(100vw, 177.78vh)',
              height: 'max(100vh, 56.25vw)',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              pointerEvents: 'none',
            }}
            title="Branding Media background"
          />}
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
                ¿Por qué llegar a la{' '}<span style={{ color: '#8B3FA8' }}>universidad?</span>
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
