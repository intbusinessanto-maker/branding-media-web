import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/*
 * Frase dividida en 3 tiempos exactamente como la pidió el cliente:
 *
 * T1: "15 universidades concesionadas en todo el país"
 *     → display grande uppercase
 *
 * T2: "Nos dan acceso a un ecosistema de más de 9 millones de personas:"
 *     → display grande uppercase
 *
 * T3: "Estudiantes, docentes, personal administrativo y, a través de ellos,
 *      miles de hogares y padres de familia que también toman decisiones de consumo."
 *     → párrafo legible (no uppercase) con palabras clave en magenta
 */
const PHRASES = [
  {
    display: true,
    normal: '15 universidades concesionadas',
    highlight: 'en todo el país',
  },
  {
    display: true,
    normal: 'Nos dan acceso a un ecosistema de',
    highlight: 'más de 9 millones de personas:',
  },
  {
    display: false,
    before: 'Estudiantes, docentes, personal administrativo y, a través de ellos, miles de hogares y padres de familia que ',
    underline: 'también toman decisiones de consumo.',
  },
]

const BG_IMG      = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'
const WALKING_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/caminando.png'

/* Resalta fragmentos del texto en color magenta */
function Highlighted({ text, keywords }) {
  let parts = [text]
  for (const kw of keywords) {
    parts = parts.flatMap(p => {
      if (typeof p !== 'string') return [p]
      const idx = p.toLowerCase().indexOf(kw.toLowerCase())
      if (idx === -1) return [p]
      return [
        p.slice(0, idx),
        <span key={kw + idx} style={{ color: '#E8118A' }}>{p.slice(idx, idx + kw.length)}</span>,
        p.slice(idx + kw.length),
      ]
    })
  }
  return <>{parts}</>
}

export default function CinematicText() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const op0 = useTransform(scrollYProgress, [0.00, 0.08, 0.28, 0.38], [0, 1, 1, 0])
  const y0  = useTransform(scrollYProgress, [0.00, 0.12], [32, 0])
  const op1 = useTransform(scrollYProgress, [0.38, 0.46, 0.62, 0.70], [0, 1, 1, 0])
  const y1  = useTransform(scrollYProgress, [0.38, 0.50], [32, 0])
  const op2 = useTransform(scrollYProgress, [0.70, 0.78, 0.94, 1.00], [0, 1, 1, 0])
  const y2  = useTransform(scrollYProgress, [0.70, 0.82], [32, 0])

  const layers = [
    { ...PHRASES[0], op: op0, yMotion: y0 },
    { ...PHRASES[1], op: op1, yMotion: y1 },
    { ...PHRASES[2], op: op2, yMotion: y2 },
  ]

  return (
    <div ref={ref} id="cinematic-outer" style={{ height: '150vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#0D0D0D', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Fondo */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#0D0D0D' }}>
          <img src={BG_IMG} alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
            onError={e => { e.target.style.display = 'none' }} />
        </div>

        {/* Viñeta — oscurece bordes para legibilidad, sin brightspot en el centro */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(13,13,13,0.55) 60%, rgba(13,13,13,0.92) 100%)',
        }} />

        {/* Puntos — sin máscara, uniformes en toda la sección */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Figura caminando */}
        <img
          src={WALKING_URL}
          alt=""
          loading="eager"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 'clamp(0px, 3vw, 40px)',
            width: 'clamp(140px, 22vw, 340px)',
            height: 'auto',
            zIndex: 4,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />

        {layers.map((layer, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
              padding: layer.display
                ? '0 clamp(1.5rem, 8vw, 6rem)'
                : '0 clamp(2rem, 10vw, 8rem)',
              zIndex: 5,
              opacity: layer.op,
              y: layer.yMotion,
              pointerEvents: 'none',
            }}
          >
            {layer.display ? (
              /* Tiempos 1 y 2 — display grande en mayúsculas */
              <>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(2rem, 5.5vw, 5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 1.05,
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.6)',
                }}>
                  {layer.normal}
                </span>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(2rem, 5.5vw, 5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 1.05,
                  color: '#E8118A',
                  textShadow: '0 2px 28px rgba(232,17,138,0.60), 0 0 60px rgba(0,0,0,0.5)',
                }}>
                  {layer.highlight}
                </span>
              </>
            ) : (
              /* Tiempo 3 — párrafo único con palabras clave en magenta */
              <p style={{
                maxWidth: '820px',
                fontSize: 'clamp(1.1rem, 2.3vw, 2.3rem)',
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.92)',
                textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.6)',
                textAlign: 'center',
                margin: 0,
              }}>
                {layer.before}
                <span style={{ color: '#E8118A', textShadow: '0 2px 28px rgba(232,17,138,0.60), 0 0 60px rgba(0,0,0,0.5)' }}>
                  {layer.underline}
                </span>
              </p>
            )}
          </motion.div>
        ))}

      </div>
    </div>
  )
}
