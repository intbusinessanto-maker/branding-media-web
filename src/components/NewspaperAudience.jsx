import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'

const MOBILE_IMG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/vista%20celuar.png'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

const VIMEO_ID   = '1204915287'
const VIMEO_HASH = 'e67a7306af'

/*
 * ── MÓVIL — slides ACUMULATIVOS ──
 * Cada pilar aparece al hacer scroll y se QUEDA visible (no desaparece).
 * A medida que el usuario baja, los pilares se van apilando verticalmente
 * hasta que los 4 están visibles al mismo tiempo.
 * Altura: 450vh (encabezado + 4 × ~85vh de scroll por pilar).
 */
function MobileAudience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  /* maxProgress — solo crece, nunca retrocede — igual que en Formats desktop */
  const maxProgress = useMotionValue(0)
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      if (v > maxProgress.get()) maxProgress.set(v)
    })
  }, [scrollYProgress, maxProgress])

  /* Header aparece al entrar */
  const headerOp = useTransform(maxProgress, [0, 0.06], [0, 1])

  /* Pilares — solo fade-in/slide-in, SIN fade-out (se quedan) */
  const op0 = useTransform(maxProgress, [0.06, 0.14], [0, 1])
  const y0  = useTransform(maxProgress, [0.06, 0.16], [28, 0])
  const op1 = useTransform(maxProgress, [0.28, 0.36], [0, 1])
  const y1  = useTransform(maxProgress, [0.28, 0.38], [28, 0])
  const op2 = useTransform(maxProgress, [0.50, 0.58], [0, 1])
  const y2  = useTransform(maxProgress, [0.50, 0.60], [28, 0])
  const op3 = useTransform(maxProgress, [0.72, 0.80], [0, 1])
  const y3  = useTransform(maxProgress, [0.72, 0.82], [28, 0])

  const pillarMotions = [
    { op: op0, y: y0 },
    { op: op1, y: y1 },
    { op: op2, y: y2 },
    { op: op3, y: y3 },
  ]

  return (
    <div ref={ref} style={{ height: '450vh', position: 'relative' }}>
      <section id="audiencia" style={{ position: 'sticky', top: 0, height: '100svh', minHeight: '600px', overflow: 'hidden', background: '#0D0D0D' }}>

        {/* Fondo único — eager para que cargue de inmediato */}
        <img src={MOBILE_IMG_URL} alt="" loading="eager" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />

        {/* Degradado */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.96) 100%)' }} />

        {/* ── Encabezado ── */}
        <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '2.4rem 1.4rem 0', opacity: headerOp, zIndex: 5 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '6px' }}>
            La audiencia
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 6.5vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '14px' }}>
            ¿Por qué llegar al{' '}<span style={{ color: '#8B3FA8' }}>campus?</span>
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(232,17,138,0.14)', border: '1px solid rgba(232,17,138,0.22)' }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1 }}>3–6h</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Tiempo en campus</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Promedio diario del estudiante</div>
            </div>
          </div>
        </motion.div>

        {/*
         * ── Pilares acumulativos ──
         * Columna de pilares anclada al fondo, cada uno aparece (sin desaparecer).
         * Usamos flexDirection column-reverse para que el último añadido
         * empuje los anteriores hacia arriba.
         */}
        <div style={{
          position: 'absolute',
          bottom: '1.8rem', left: '1.4rem', right: '1.4rem',
          display: 'flex', flexDirection: 'column', gap: '10px',
          zIndex: 5,
        }}>
          {/* Renderizamos en orden inverso para que col-reverse funcione correctamente */}
          {[...pillars].reverse().map((p, revI) => {
            const i = pillars.length - 1 - revI
            return (
              <motion.div
                key={p.number}
                style={{
                  opacity: pillarMotions[i].op,
                  y: pillarMotions[i].y,
                }}
              >
                <div style={{
                  display: 'flex', gap: '12px', padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(0,0,0,0.68)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderLeft: `4px solid ${p.color}`,
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '3px 7px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '2px' }}>
                    {p.number}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}>{p.title}</h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{p.body}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </section>
    </div>
  )
}

const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

/* ── DESKTOP ── */
export default function NewspaperAudience() {
  const [isMobile, setIsMobile] = useState(IS_MOBILE_INIT)
  const [showVideo, setShowVideo] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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
