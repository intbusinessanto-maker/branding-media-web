import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

/*
 * Archivos que el usuario debe subir a Supabase con estos nombres exactos:
 *   - persona-maquina-escribir.png   (persona izquierda con maquina, fondo transparente)
 *   - persona-periodico.png          (persona derecha leyendo, fondo transparente)
 *   - fondo-periodico-ciudad.jpg     (collage ciudad/periodico en B&W, imagen 2)
 */
const TYPEWRITER_IMG = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/persona-maquina-escribir.png'
const NEWSPAPER_IMG  = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/persona-periodico.png'
const BG_NEWSPAPER   = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/fondo-periodico-ciudad.jpg'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',      color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                          color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                        color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                    color: '#00C4AD' },
]

/* Stat destacado */
function StatBlock() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '18px',
      padding: '18px 22px', borderRadius: '12px',
      background: 'rgba(232,17,138,0.1)',
      border: '1px solid rgba(232,17,138,0.2)',
      marginBottom: '24px',
    }}>
      <div style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>
        3–6h
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Tiempo en campus</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Promedio diario del estudiante</div>
      </div>
    </div>
  )
}

/* Layout móvil simple */
function MobileAudience() {
  return (
    <section id="audiencia" style={{ padding: '72px 1.5rem', background: '#111' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '10px' }}>
        La audiencia
      </span>
      <h2 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '18px' }}>
        ¿Por qué llegar al <span style={{ color: '#8B3FA8' }}>campus?</span>
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.75, marginBottom: '28px' }}>
        Colombia tiene más de 2 millones de estudiantes universitarios activos, formando sus hábitos de consumo.
      </p>
      <StatBlock />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pillars.map((p, i) => (
          <motion.div key={p.number}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{
              display: 'flex', gap: '14px', padding: '16px',
              borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${p.color}`,
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 900, color: p.color, background: `${p.color}15`, padding: '3px 8px', borderRadius: '6px', flexShrink: 0, height: 'fit-content' }}>{p.number}</span>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{p.title}</h4>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{p.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* SVG arco de papel — crece de izquierda a derecha */
function PaperArc({ progress }) {
  const pathLength = useTransform(progress, [0.08, 0.55], [0, 1])
  const pathLengthSpring = useSpring(pathLength, { stiffness: 50, damping: 16 })

  return (
    <svg
      viewBox="0 0 1200 200"
      style={{
        position: 'absolute',
        top: '28%', left: '50%',
        transform: 'translateX(-50%)',
        width: '80%', height: 'auto',
        pointerEvents: 'none', zIndex: 3,
        overflow: 'visible',
      }}
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 40,160 C 200,160 250,40 600,40 C 950,40 1000,160 1160,160"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        style={{ pathLength: pathLengthSpring }}
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  )
}

export default function NewspaperAudience() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const leftX       = useTransform(scrollYProgress, [0.0, 0.18, 0.82, 1.0], [-360, 0, 0, -360])
  const rightX      = useTransform(scrollYProgress, [0.0, 0.18, 0.82, 1.0], [ 360, 0, 0,  360])
  const peopleOp    = useTransform(scrollYProgress, [0.05, 0.18, 0.82, 0.95], [0, 1, 1, 0])
  const contentOp   = useTransform(scrollYProgress, [0.20, 0.38], [0, 1])
  const contentY    = useTransform(scrollYProgress, [0.20, 0.38], [30, 0])

  const leftXSpring  = useSpring(leftX,  { stiffness: 70, damping: 22 })
  const rightXSpring = useSpring(rightX, { stiffness: 70, damping: 22 })

  if (isMobile) return <MobileAudience />

  return (
    <section ref={ref} id="audiencia" style={{ height: '200vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Fondo periódico/ciudad */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${BG_NEWSPAPER})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'grayscale(1) brightness(0.25) contrast(1.1)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.78)' }} />

        {/* Patrón de ruido sutil */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />

        {/* Arco de papel SVG */}
        <PaperArc progress={scrollYProgress} />

        {/* Persona izquierda — maquina de escribir */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0,
            x: leftXSpring, opacity: peopleOp,
            zIndex: 4,
          }}
        >
          <img
            src={TYPEWRITER_IMG} alt=""
            style={{
              height: 'clamp(280px, 50vh, 480px)',
              objectFit: 'contain',
              filter: 'grayscale(1) contrast(1.05) brightness(0.95)',
            }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </motion.div>

        {/* Persona derecha — periodico */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, right: 0,
            x: rightXSpring, opacity: peopleOp,
            zIndex: 4,
          }}
        >
          <img
            src={NEWSPAPER_IMG} alt=""
            style={{
              height: 'clamp(280px, 50vh, 480px)',
              objectFit: 'contain',
              filter: 'grayscale(1) contrast(1.05) brightness(0.95)',
            }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </motion.div>

        {/* Contenido central sobre el papel */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, pointerEvents: 'none',
          padding: '0 clamp(140px, 16vw, 240px)',
        }}>
          <motion.div
            style={{ opacity: contentOp, y: contentY }}
            transition={{ duration: 0.0 }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '10px' }}>
                La audiencia
              </span>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                fontWeight: 900, color: '#fff',
                letterSpacing: '-0.03em', lineHeight: 1.08,
              }}>
                ¿Por qué llegar al{' '}
                <span style={{ color: '#8B3FA8' }}>campus?</span>
              </h2>
            </div>

            {/* Stat */}
            <StatBlock />

            {/* Pilares */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', pointerEvents: 'all' }}>
              {pillars.map((p, i) => (
                <motion.div
                  key={p.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.5 }}
                  style={{
                    display: 'flex', gap: '10px', padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderLeft: `3px solid ${p.color}`,
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}18`, padding: '2px 6px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '1px' }}>
                    {p.number}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{p.title}</h4>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
