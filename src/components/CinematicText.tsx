import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

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

const slideVariants = {
  enter: { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -60,
    transition: { duration: 0.45, ease: [0.55, 0, 0.78, 0] },
  },
}

export default function CinematicText() {
  const [index, setIndex] = useState(0)
  // scrollHeight = 4 * 100vh: 1 vh fija + 3 vh de scroll (una por frase)
  const SCROLL_STEPS = PHRASES.length
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      // rect.top es negativo cuando hacemos scroll hacia abajo dentro del sticky
      const scrolled = -rect.top
      const stepH    = window.innerHeight
      const clamped  = Math.max(0, Math.min(scrolled, stepH * (SCROLL_STEPS - 1)))
      const newIdx   = Math.round(clamped / stepH)
      setIndex(newIdx)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const phrase = PHRASES[index]

  return (
    /*
     * Wrapper externo: altura = (N+1) * 100vh para reservar espacio de scroll.
     * El inner sticky se queda fijo en la ventana mientras scrolleamos ese espacio.
     */
    <div
      ref={wrapperRef}
      style={{ height: `${(SCROLL_STEPS + 1) * 100}vh`, position: 'relative' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: 'clamp(4rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem)',
      }}>
        {/* Fondo textura */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={BG_IMG}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        {/* Puntos */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Frases con transición vertical */}
        <div style={{
          position: 'relative', zIndex: 3, width: '100%', maxWidth: '920px',
          minHeight: 'clamp(220px, 40vh, 420px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              variants={slideVariants}
              initial="enter"
              animate="visible"
              exit="exit"
              style={{ position: 'absolute', width: '100%', textAlign: 'center' }}
            >
              {phrase.display ? (
                <>
                  <span style={{
                    display: 'block',
                    fontSize: 'clamp(1.8rem, 5vw, 4.8rem)',
                    fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08,
                    color: 'rgba(255,255,255,0.92)',
                    textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                  }}>
                    {phrase.normal}
                  </span>
                  <span style={{
                    display: 'block',
                    fontSize: 'clamp(1.8rem, 5vw, 4.8rem)',
                    fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08,
                    color: '#E8118A',
                    textShadow: '0 2px 24px rgba(232,17,138,0.55)',
                  }}>
                    {phrase.highlight}
                  </span>
                </>
              ) : (
                <p style={{
                  fontSize: 'clamp(1rem, 2.2vw, 2.1rem)', fontWeight: 900,
                  lineHeight: 1.25, letterSpacing: '-0.03em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.88)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                  textAlign: 'center', margin: 0,
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

        {/* Indicadores */}
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', gap: '8px' }}>
          {PHRASES.map((_, i) => (
            <div key={i} style={{
              width: i === index ? '24px' : '8px',
              height: '8px', borderRadius: '4px',
              background: i === index ? '#E8118A' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* Hint de scroll — se oculta en la última frase */}
        <AnimatePresence>
          {index < SCROLL_STEPS - 1 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', bottom: '28px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                zIndex: 3, pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>scroll</span>
              <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)', animation: 'ct-scroll 2s ease-in-out infinite' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @keyframes ct-scroll {
            0%,100% { opacity:.8; transform:scaleY(1) }
            50%     { opacity:.2; transform:scaleY(.35) }
          }
        `}</style>
      </div>
    </div>
  )
}
