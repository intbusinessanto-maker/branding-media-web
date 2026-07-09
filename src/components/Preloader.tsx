import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO_WHITE = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo%20Branding%20Media%20(f%20blanco).png'
const ESLOGAN    = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/eslogan.webp'

/*
 * Fases del preloader (igual que Pixy):
 * 0 — pantalla vacía oscura (entrada)
 * 1 — palabras entran escalonadas: "Publicidad" · "en" · "universidades"
 * 2 — palabras salen hacia arriba
 * 3 — barra de reveal barre de izq → der → abre el logo BM
 * 4 — logo BM visible solo
 * 5 — eslogan "movemos marcas" entra
 * 6 — todo sale: fade out completo
 */

const WORDS = ['Publicidad', 'en', 'universidades']

const PHASE_DURATIONS = {
  initial:    300,   // pausa antes de empezar
  wordEnter:  900,   // tiempo total de entrada de las 3 palabras
  wordHold:   500,   // pausa con palabras visibles
  wordExit:   500,   // palabras salen hacia arriba
  revealBar:  650,   // barra barre de izq a der
  logoHold:   700,   // logo BM solo visible
  esloganIn:  800,   // eslogan entra y se sostiene
  fadeOut:    700,   // fade total del preloader
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<0|1|2|3|4|5|6>(0)
  const [visible, setVisible] = useState(true)
  const doneRef = useRef(false)

  useEffect(() => {
    /*
     * Solo bloqueamos overflow en html+body — sin position:fixed para no
     * desplazar el body. El preloader ya cubre todo con position:fixed+zIndex,
     * así que el usuario no puede hacer scroll de todas formas.
     * Al terminar, forzamos scrollTo(0,0) sin condiciones para garantizar
     * que siempre se aterrice en el top, sin importar reflows por deferred mount.
     */
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const go = (p: 0|1|2|3|4|5|6, delay: number) =>
      setTimeout(() => setPhase(p), delay)

    let t = 0
    t += PHASE_DURATIONS.initial;                               const t1 = go(1, t)
    t += PHASE_DURATIONS.wordEnter + PHASE_DURATIONS.wordHold;  const t2 = go(2, t)
    t += PHASE_DURATIONS.wordExit;                              const t3 = go(3, t)
    t += PHASE_DURATIONS.revealBar;                             const t4 = go(4, t)
    t += PHASE_DURATIONS.logoHold;                              const t5 = go(5, t)
    t += PHASE_DURATIONS.esloganIn;                             const t6 = go(6, t)
    t += PHASE_DURATIONS.fadeOut
    const tDone = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        const hash = window.location.hash
        if (hash) {
          // Deja que el browser resuelva el anchor tras el preloader
          setTimeout(() => {
            const el = document.getElementById(hash.slice(1))
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }, 120)
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
        }
        setVisible(false)
        setTimeout(onDone, 80)
      }
    }, t)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6)
      clearTimeout(tDone)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#0D0D0D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ─── FASE 1+2: Palabras escalonadas ─── */}
          <div
            style={{
              position: 'absolute',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.15em',
              pointerEvents: 'none',
            }}
          >
            {WORDS.map((word, i) => (
              <div key={word} style={{ overflow: 'hidden', lineHeight: 1 }}>
                <motion.p
                  initial={{ y: '110%', opacity: 0 }}
                  animate={
                    phase >= 1 && phase < 2
                      ? { y: '0%', opacity: 1 }
                      : phase >= 2
                        ? { y: '-110%', opacity: 0 }
                        : { y: '110%', opacity: 0 }
                  }
                  transition={
                    phase >= 2
                      ? { duration: 0.38, ease: [0.55, 0, 1, 0.45], delay: i * 0.05 }
                      : { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.22 }
                  }
                  style={{
                    margin: 0,
                    fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: i === 2 ? '#E8118A' : '#fff',
                    lineHeight: 1,
                    textAlign: 'center',
                    willChange: 'transform',
                  }}
                >
                  {word}
                </motion.p>
              </div>
            ))}
          </div>

          {/* ─── FASES 3-5: Reveal bar + Logo BM + Eslogan (secuencial) ─── */}
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Logo BM — aparece tras la barra, sale cuando entra el eslogan */}
            <AnimatePresence>
              {phase >= 4 && phase < 5 && (
                <motion.img
                  key="logo-bm"
                  src={LOGO_WHITE}
                  alt="Branding Media"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -24, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute',
                    height: 'clamp(80px, 18vw, 180px)',
                    width: 'auto', objectFit: 'contain',
                    filter: 'drop-shadow(0 0 40px rgba(232,17,138,0.35))',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Eslogan — entra solo en fase 5 */}
            <AnimatePresence>
              {phase >= 5 && (
                <motion.img
                  key="eslogan"
                  src={ESLOGAN}
                  alt="movemos marcas"
                  initial={{ opacity: 0, y: 20, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute',
                    height: 'clamp(44px, 9vw, 90px)',
                    width: 'auto', objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.9)) brightness(1.05)',
                  }}
                />
              )}
            </AnimatePresence>

            {/* Barra de reveal — barre de izq a der en fase 3 */}
            <AnimatePresence>
              {phase === 3 && (
                <motion.div
                  key="reveal-bar"
                  initial={{ scaleX: 0, transformOrigin: 'left center' }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0, transformOrigin: 'right center' }}
                  transition={{
                    duration: PHASE_DURATIONS.revealBar / 1000,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: '#E8118A',
                    zIndex: 2,
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Línea de acento inferior (brand) */}
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #E8118A, #8B3FA8, #00C4AD)',
              opacity: phase >= 4 ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
