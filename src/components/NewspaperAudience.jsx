import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/*
 * Capas:
 *   0 — webp de fondo (ciudad/periódico, oscurecido, siempre visible)
 *   1 — PNG sin fondo de las dos personas (estático, ambas personas siempre visibles)
 *   2 — SVG papel animado: crece de derecha → izquierda al hacer scroll,
 *         con perspectiva 3D (rotateX) y brillo propio
 *   3 — texto centrado con backdrop-blur
 */
const BG_URL  = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico%20y%20maquina%20de%20escribir.webp'
const PNG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico_y_maquina_de_escribir-removebg-preview.png'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

/* ── SVG PAPEL 3D ──
 * El papel va de derecha (mecanógrafo) a izquierda (lector periódico).
 * Arco Bézier: empieza en x≈78%, sube en curva y llega a x≈20%.
 * viewBox="0 0 100 100" + preserveAspectRatio="none" → cada unidad = 1% del viewport.
 * El contenedor tiene perspective + rotateX para el efecto 3D.
 */
function PaperSVG({ scrollYProgress }) {
  /* pathLength 0→1 conforme el usuario baja */
  const rawLen   = useTransform(scrollYProgress, [0.06, 0.52], [0, 1])
  const paperLen = useSpring(rawLen, { stiffness: 46, damping: 15, mass: 0.9 })

  /* rotateX: empieza inclinado (3D pronunciado) y se aplana al llegar */
  const rawRot  = useTransform(scrollYProgress, [0.06, 0.52, 0.80], [28, 6, 6])
  const rotateX = useSpring(rawRot, { stiffness: 38, damping: 12 })

  /* ligera oscilación vertical para efecto de papel flotando */
  const floatY = useTransform(scrollYProgress, v => Math.sin(v * Math.PI * 4) * 3)

  /* opacidad del papel — aparece al inicio del scroll */
  const paperOp = useTransform(scrollYProgress, [0.04, 0.14], [0, 1])

  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        zIndex: 6, pointerEvents: 'none',
        perspective: '700px',
        perspectiveOrigin: '50% 45%',
        opacity: paperOp,
        y: floatY,
      }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          overflow: 'visible',
          rotateX,
          transformOrigin: '50% 45%',
        }}
      >
        <defs>
          {/* Gradiente de izquierda a derecha para dar profundidad al papel */}
          <linearGradient id="pgLeft" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.95)" />
            <stop offset="40%"  stopColor="rgba(240,235,220,0.80)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.90)" />
          </linearGradient>
          {/* Glow blur */}
          <filter id="pglow" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* SOMBRA — ligeramente desplazada hacia abajo y derecha */}
        <motion.path
          d="M 78,50 C 72,10 28,10 21,47"
          fill="none"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ pathLength: paperLen }}
          transform="translate(0.6, 1.4)"
        />

        {/* BORDE INFERIOR del papel (grosor) */}
        <motion.path
          d="M 78,50 C 72,10 28,10 21,47"
          fill="none"
          stroke="rgba(180,165,140,0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ pathLength: paperLen }}
          transform="translate(0, 1.1)"
        />

        {/* CUERPO PRINCIPAL del papel */}
        <motion.path
          d="M 78,50 C 72,10 28,10 21,47"
          fill="none"
          stroke="url(#pgLeft)"
          strokeWidth="2.4"
          strokeLinecap="round"
          style={{ pathLength: paperLen }}
          filter="url(#pglow)"
        />

        {/* HIGHLIGHT superior (borde iluminado) */}
        <motion.path
          d="M 78,50 C 72,10 28,10 21,47"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="0.5"
          strokeLinecap="round"
          style={{ pathLength: paperLen }}
          transform="translate(0, -0.9)"
        />

        {/* Punto de origen — círculo en el mecanógrafo */}
        <motion.circle
          cx="78" cy="50" r="1.2"
          fill="rgba(255,255,255,0.9)"
          style={{ opacity: paperLen }}
        />
        {/* Punto de destino — círculo en el lector */}
        <motion.circle
          cx="21" cy="47" r="1.2"
          fill="rgba(255,255,255,0.9)"
          style={{ opacity: useTransform(paperLen, v => v > 0.88 ? (v - 0.88) / 0.12 : 0) }}
        />
      </motion.svg>
    </motion.div>
  )
}

/* ── MÓVIL ── */
function MobileAudience() {
  return (
    <section id="audiencia" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '280px', position: 'relative' }}>
        <img src={BG_URL} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.5)' }} />
        <img src={PNG_URL} alt="" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: '100%', objectFit: 'contain' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #111 100%)' }} />
      </div>
      <div style={{ background: '#111', padding: '0 1.5rem 72px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px', marginTop: '4px' }}>
          La audiencia
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
          ¿Por qué llegar al{' '}<span style={{ color: '#8B3FA8' }}>campus?</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '10px', background: 'rgba(232,17,138,0.12)', border: '1px solid rgba(232,17,138,0.2)', marginBottom: '18px' }}>
          <span style={{ fontSize: '36px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>3–6h</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Tiempo en campus</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Promedio diario del estudiante</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pillars.map((p, i) => (
            <motion.div key={p.number} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${p.color}` }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}18`, padding: '3px 7px', borderRadius: '5px', flexShrink: 0, height: 'fit-content' }}>{p.number}</span>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{p.title}</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </motion.div>
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

  /*
   * offset ['start start', 'end start']:
   *   0 = top de la section llega al top del viewport
   *   1 = bottom de la section llega al top del viewport (sección completamente salió)
   * Esto da exactamente 250vh de rango de scroll para animar suavemente.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  /* Texto: aparece casi de inmediato al entrar la sección */
  const textOp = useTransform(scrollYProgress, [0, 0.06], [0, 1])
  const textY  = useTransform(scrollYProgress, [0, 0.06], [18, 0])

  if (isMobile) return <MobileAudience />

  return (
    <section
      ref={ref}
      id="audiencia"
      style={{ height: '250vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >

        {/* ── CAPA 0: fondo webp — siempre visible, sin overlay negro ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.48)',
        }} />

        {/* ── CAPA 1: PNG personas — siempre visible, sin fade ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${PNG_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* ── CAPA 2: SVG PAPEL 3D — único elemento animado ── */}
        <PaperSVG scrollYProgress={scrollYProgress} />

        {/* ── CAPA 3: TEXTO centrado ──
              El div externo maneja el centrado CSS puro.
              El motion.div interno maneja solo opacity/y sin conflicto. */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(320px, 40%, 560px)',
            zIndex: 10,
          }}
        >
        <motion.div style={{ opacity: textOp, y: textY }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px 16px', textAlign: 'center',
            background: 'rgba(0,0,0,0.68)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px 16px 0 0',
            border: '1px solid rgba(255,255,255,0.09)',
            borderBottom: 'none',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
              La audiencia
            </span>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
              ¿Por qué llegar al{' '}<span style={{ color: '#8B3FA8' }}>campus?</span>
            </h2>
          </div>

          {/* Stat 3–6h */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '13px 20px',
            background: 'rgba(232,17,138,0.16)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(232,17,138,0.25)',
            borderTop: 'none', borderBottom: 'none',
          }}>
            <span style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0, textShadow: '0 0 24px rgba(232,17,138,0.5)' }}>
              3–6h
            </span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>Tiempo promedio en campus</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Más que en cualquier otro entorno</div>
            </div>
          </div>

          {/* Pilares 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {pillars.map((p, i) => (
              <div
                key={p.number}
                style={{
                  display: 'flex', gap: '9px', padding: '12px 13px',
                  background: 'rgba(0,0,0,0.68)',
                  backdropFilter: 'blur(20px)',
                  borderLeft: `3px solid ${p.color}`,
                  borderRadius:
                    i === 0 ? '0' :
                    i === 1 ? '0' :
                    i === 2 ? '0 0 0 16px' :
                    '0 0 16px 0',
                }}
              >
                <span style={{ fontSize: '9px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '2px 5px', borderRadius: '4px', flexShrink: 0, height: 'fit-content', marginTop: '1px' }}>
                  {p.number}
                </span>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginBottom: '2px', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,1)' }}>{p.title}</h4>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        </div>

        {/* Indicador de scroll — se desvanece tras el primer scroll */}
        <motion.div
          style={{
            position: 'absolute', bottom: '5%', left: '50%',
            transform: 'translateX(-50%)',
            opacity: useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0]),
            zIndex: 8, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
          }}
        >
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.2)' }} />
        </motion.div>

      </div>
    </section>
  )
}
