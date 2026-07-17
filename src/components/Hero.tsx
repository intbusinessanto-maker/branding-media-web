import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

/*
 * Hero tipo Pixy:
 * DESKTOP — grilla 2 columnas: texto izq | imagen der
 * MOBILE  — columna: tag → título → imagen → CTA
 *
 * Imagen: flotación CSS continua (translateY -20%↔-30%, scale 0.9↔1.0, 20s loop)
 * igual que Pixy. Más leve parallax del cursor encima (desktop).
 */

const IMG_SRC  = '/ok-tv.png'
const TITLE    = 'Movemos marcas en universidades'
const TAG_TEXT = 'Circuito de pauta dentro de las universidades más grandes de Latinoamérica'

const WORDS = TITLE.split(' ')

const ALL_LETTERS: { ch: string; globalIdx: number; wordIdx: number }[] = []
let gi = 0
WORDS.forEach((w, wi) => {
  w.split('').forEach(ch => {
    ALL_LETTERS.push({ ch, globalIdx: gi++, wordIdx: wi })
  })
  if (wi < WORDS.length - 1) ALL_LETTERS.push({ ch: ' ', globalIdx: -1, wordIdx: wi })
})
const LETTER_COUNT = gi

export default function Hero({ videoActive: _va = true }) {
  const [ready, setReady]       = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef            = useRef<HTMLDivElement>(null)

  /* Springs solo para el leve parallax del cursor (desktop) — NO controla la flotación */
  const cursorX = useSpring(0, { stiffness: 40, damping: 20, mass: 1 })
  const cursorY = useSpring(0, { stiffness: 40, damping: 20, mass: 1 })

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  /* Leve parallax del cursor — solo desktop, max ±10px igual que Pixy */
  useEffect(() => {
    if (isMobile) return
    const el = containerRef.current
    const onMove = (e: MouseEvent) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2  // -1..1
      const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2
      cursorX.set(nx * 10)   // max ±10px
      cursorY.set(ny * 10)
    }
    const onLeave = () => { cursorX.set(0); cursorY.set(0) }
    el?.addEventListener('mousemove', onMove)
    el?.addEventListener('mouseleave', onLeave)
    return () => {
      el?.removeEventListener('mousemove', onMove)
      el?.removeEventListener('mouseleave', onLeave)
    }
  }, [isMobile])

  const titleDelay     = 0.35
  const letterStagger  = 0.028
  const ctaDelay       = titleDelay + LETTER_COUNT * letterStagger + 0.15


  const Title = (
    <h1 style={{
      margin: 0, padding: 0,
      fontSize: isMobile
        ? 'clamp(2.4rem, 10.5vw, 3.6rem)'
        : 'clamp(3rem, 5.8vw, 6.4rem)',
      fontWeight: 900,
      letterSpacing: '-0.04em',
      lineHeight: 1.05,
      color: '#fff',
      textAlign: isMobile ? 'center' : 'left',
      /* Permite que las palabras se envuelvan pero nunca parte una palabra */
      wordBreak: 'keep-all',
      overflowWrap: 'normal',
    }}>
      {WORDS.map((word, wi) => (
        <span
          key={wi}
          style={{
            display: 'inline-block',
            /* "universidades" (última palabra) nunca se rompe */
            whiteSpace: 'nowrap',
          }}
        >
          {word.split('').map((ch, ci) => {
            const prevLetters = WORDS.slice(0, wi).reduce((acc, w) => acc + w.length, 0)
            const realGlobalIdx = prevLetters + ci
            const isAccent = wi === WORDS.length - 1
            return (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: 38, rotateX: -55 }}
                animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 600, damping: 14 } }}
                transition={{
                  duration: 0.62,
                  ease: [0.22, 1, 0.36, 1],
                  delay: titleDelay + realGlobalIdx * letterStagger,
                }}
                style={{
                  display: 'inline-block',
                  transformOrigin: 'bottom center',
                  color: isAccent ? '#E8118A' : 'inherit',
                  cursor: 'default',
                }}
              >
                {ch}
              </motion.span>
            )
          })}
          {/* Espacio entre palabras (excepto la última) */}
          {wi < WORDS.length - 1 && (
            <span style={{ display: 'inline-block', width: '0.22em' }} />
          )}
        </span>
      ))}
    </h1>
  )

  const BottomTag = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: ctaDelay }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: isMobile ? '7px 13px' : '8px 16px',
        borderRadius: '100px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.045)',
        backdropFilter: 'blur(10px)',
        maxWidth: isMobile ? '100%' : '480px',
      }}
    >
      <span style={{ position: 'relative', width: 7, height: 7, flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00C4AD', animation: 'hpulse 2.2s ease-in-out infinite' }} />
        <span style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', background: 'rgba(0,196,173,0.22)', animation: 'hpulse-ring 2.2s ease-in-out infinite' }} />
      </span>
      <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 500, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
        {TAG_TEXT}
      </span>
    </motion.div>
  )

  const Image3D = (
    /*
     * La flotación oscila ±16px en Y y ±4px en X alrededor del centro,
     * ciclo de 6s. El contenedor recibe el leve parallax del cursor (desktop).
     * overflow:visible en el wrapper pero el section tiene overflow:hidden —
     * la imagen nunca sale del viewport.
     */
    <motion.div
      style={{ x: cursorX, y: cursorY, width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end' }}
    >
      {/* Blob de luz detrás — flota al mismo ritmo */}
      <div style={{
        position: 'absolute', left: '10%', right: '10%',
        top: '30%', bottom: '5%',
        borderRadius: '50%',
        background: 'rgba(139,63,168,0.4)',
        filter: 'blur(55px)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'hero-blob 6s ease-in-out infinite',
      }} />

      {/* ── Figuras decorativas flotantes ── */}
      {/* Zigzag — arriba izquierda */}
      <svg viewBox="0 0 48 28" width="54" height="32" style={{ position:'absolute', top:'-8%', left:'-12%', zIndex:2, pointerEvents:'none', animation:'deco-float-a 5s ease-in-out infinite' }}>
        <polyline points="0,24 12,4 24,24 36,4 48,24" fill="none" stroke="#E8118A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Checkmark curvo — arriba derecha */}
      <svg viewBox="0 0 40 32" width="46" height="36" style={{ position:'absolute', top:'2%', right:'-14%', zIndex:2, pointerEvents:'none', animation:'deco-float-b 6s ease-in-out infinite' }}>
        <polyline points="4,16 16,26 36,4" fill="none" stroke="#00C4AD" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Cruz / estrella — derecha media */}
      <svg viewBox="0 0 28 28" width="34" height="34" style={{ position:'absolute', top:'42%', right:'-16%', zIndex:2, pointerEvents:'none', animation:'deco-float-a 7s ease-in-out infinite 0.8s' }}>
        <line x1="14" y1="2" x2="14" y2="26" stroke="#8B3FA8" strokeWidth="6" strokeLinecap="round"/>
        <line x1="2" y1="14" x2="26" y2="14" stroke="#8B3FA8" strokeWidth="6" strokeLinecap="round"/>
      </svg>

      {/* Línea ondulada / curva — abajo derecha */}
      <svg viewBox="0 0 56 28" width="62" height="32" style={{ position:'absolute', bottom:'4%', right:'-10%', zIndex:2, pointerEvents:'none', animation:'deco-float-b 5.5s ease-in-out infinite 0.4s' }}>
        <path d="M4,14 C14,2 22,26 32,14 C42,2 50,20 54,14" fill="none" stroke="#E8118A" strokeWidth="5.5" strokeLinecap="round"/>
      </svg>

      {/* Zigzag pequeño — abajo izquierda */}
      <svg viewBox="0 0 40 22" width="44" height="26" style={{ position:'absolute', bottom:'8%', left:'-14%', zIndex:2, pointerEvents:'none', animation:'deco-float-a 6.5s ease-in-out infinite 1.2s' }}>
        <polyline points="0,18 10,4 20,18 30,4 40,18" fill="none" stroke="#00C4AD" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Punto decorativo — izquierda media */}
      <svg viewBox="0 0 22 22" width="22" height="22" style={{ position:'absolute', top:'55%', left:'-10%', zIndex:2, pointerEvents:'none', animation:'deco-float-b 4.5s ease-in-out infinite 0.6s' }}>
        <circle cx="11" cy="11" r="9" fill="#8B3FA8" opacity="0.9"/>
      </svg>

      {/* Imagen con flotación continua */}
      <motion.img
        src={IMG_SRC}
        alt="Pantalla Branding Media en universidad"
        draggable={false}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', height: isMobile ? 'auto' : '100%', display: 'block',
          objectFit: 'contain', objectPosition: 'center bottom',
          filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.55))',
          userSelect: 'none',
          animation: 'hero-float 6s ease-in-out infinite',
        }}
      />
    </motion.div>
  )

  return (
    <section
      id="inicio"
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#0D0D0D',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: isMobile
          ? 'clamp(88px,13vh,120px) 1.4rem clamp(60px,9vh,90px)'
          : 'clamp(100px,12vh,140px) clamp(2rem,6vw,6rem) clamp(60px,8vh,100px)',
      }}
    >
      {/* Textura Fondo 2 — misma que CinematicText, visible en mobile y desktop */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url(https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.1,
      }} />

      {/* Resplandor de fondo */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 60% 55%, rgba(139,63,168,0.14) 0%, transparent 65%)',
      }} />

      {/* ── DESKTOP: grilla 2 col ── */}
      {!isMobile && (
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(32px, 5vw, 72px)',
          alignItems: 'stretch',
        }}>
          {/* Texto izquierda: título arriba, chip abajo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', justifyContent: 'center' }}>
            {Title}
            {BottomTag}
          </div>
          {/* Imagen derecha */}
          <div style={{
            display: 'flex', alignItems: 'stretch', justifyContent: 'center',
          }}>
            <div style={{ width: '100%' }}>{Image3D}</div>
          </div>
        </div>
      )}

      {/* ── MOBILE: columna centrada ── */}
      {isMobile && (
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}>
          {Title}
          <div style={{ width: 'min(72vw, 280px)', padding: '20px 0' }}>
            {Image3D}
          </div>
          {BottomTag}
        </div>
      )}

      {/* Indicador scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: ctaDelay + 0.5, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          zIndex: 3, pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>scroll</span>
        <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)', animation: 'hscroll 2s ease-in-out infinite' }} />
      </motion.div>

      <style>{`
        /* Flotación centrada: oscila ±16px en Y, ±4px en X, ciclo 6s */
        @keyframes hero-float {
          0%   { transform: translateY(-16px) translateX(4px); }
          50%  { transform: translateY(16px)  translateX(-4px); }
          100% { transform: translateY(-16px) translateX(4px); }
        }
        @keyframes hero-blob {
          0%   { transform: translateY(-10px); opacity: 0.7; }
          50%  { transform: translateY(10px);  opacity: 1; }
          100% { transform: translateY(-10px); opacity: 0.7; }
        }
        @keyframes hpulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(.8)} }
        @keyframes hpulse-ring { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:0;transform:scale(2)} }
        @keyframes hscroll     { 0%,100%{opacity:.8;transform:scaleY(1)} 50%{opacity:.25;transform:scaleY(.35)} }
        @keyframes deco-float-a { 0%,100%{transform:translateY(-8px) rotate(-4deg)} 50%{transform:translateY(8px) rotate(4deg)} }
        @keyframes deco-float-b { 0%,100%{transform:translateY(6px) rotate(3deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
      `}</style>
    </section>
  )
}
