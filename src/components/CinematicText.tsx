import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

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

const BG_IMG = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'

const HOLD_MS = 2800
const ANIM_DURATION = 0.5

const carouselVariants = {
  enter: { opacity: 0, x: 120 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: ANIM_DURATION, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, x: -120,
    transition: { duration: ANIM_DURATION, ease: [0.55, 0, 0.78, 0] },
  },
}

export default function CinematicText() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % PHRASES.length)
    }, HOLD_MS)
    return () => clearInterval(timer)
  }, [])

  const phrase = PHRASES[index]

  return (
    <section
      id="cinematic-outer"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#0D0D0D',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: 'clamp(4rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem)',
      }}
    >
      {/* Fondo con textura — opacidad muy baja para que quede casi negro */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={BG_IMG}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.08,
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>

      {/* Puntos uniformes sobre toda la sección */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Carrusel horizontal de frases */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        maxWidth: '920px',
        minHeight: 'clamp(220px, 40vh, 420px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={carouselVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {phrase.display ? (
              <>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(1.8rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.08,
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                }}>
                  {phrase.normal}
                </span>
                <span style={{
                  display: 'block',
                  fontSize: 'clamp(1.8rem, 5vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.08,
                  color: '#E8118A',
                  textShadow: '0 2px 24px rgba(232,17,138,0.55)',
                }}>
                  {phrase.highlight}
                </span>
              </>
            ) : (
              <p style={{
                fontSize: 'clamp(1rem, 2.2vw, 2.1rem)',
                fontWeight: 900,
                lineHeight: 1.25,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.88)',
                textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                textAlign: 'center',
                margin: 0,
              }}>
                {phrase.before}
                <span style={{ color: '#E8118A', textShadow: '0 2px 24px rgba(232,17,138,0.55)' }}>
                  {phrase.underline}
                </span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicadores de progreso */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        display: 'flex',
        gap: '8px',
        marginTop: '0',
      }}>
        {PHRASES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === index ? '#E8118A' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
