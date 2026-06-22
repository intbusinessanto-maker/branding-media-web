import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO    = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo%20Branding%20Media%20(f%20blanco).png'
const ESLOGAN = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/eslogan.webp'

export default function VideoIntro({ onDismiss }) {
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 700)
  }

  useEffect(() => {
    const t = setTimeout(dismiss, 12000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', overflow: 'hidden' }}
        >
          {/* YouTube iframe — cubre toda la pantalla */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <iframe
              src="https://www.youtube.com/embed/68paHyhJHPU?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=68paHyhJHPU&rel=0&showinfo=0&iv_load_policy=3&disablekb=1"
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100vh * 1.7778)', height: '100vh',
                minWidth: '100vw', minHeight: 'calc(100vw * 0.5625)',
                border: 'none',
              }}
              allow="autoplay; encrypted-media"
              title="Branding Media intro"
            />
          </div>

          {/* Gradientes */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.78) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.2) 100%)' }} />

          {/* Logo top-left */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ position: 'absolute', top: '28px', left: '36px', zIndex: 10 }}
          >
            <img src={LOGO} alt="Branding Media" style={{ height: 'clamp(72px, 10vw, 110px)', objectFit: 'contain' }} />
          </motion.div>

          {/* Contenido bottom */}
          <motion.div
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: 'clamp(20px, 4vw, 44px) clamp(20px, 5vw, 48px)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              flexWrap: 'wrap', gap: '20px', zIndex: 10,
            }}
          >
            <div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600 }}>
                El circuito universitario más grande de Colombia
              </p>
              {/* Eslogan como imagen — reemplaza el texto anterior */}
              <img
                src={ESLOGAN}
                alt="Movemos marcas en universidades"
                style={{
                  height: 'clamp(52px, 10vw, 120px)',
                  width: 'auto',
                  maxWidth: '72vw',
                  objectFit: 'contain',
                  objectPosition: 'left center',
                  display: 'block',
                  filter: 'drop-shadow(0 2px 18px rgba(0,0,0,0.9))',
                }}
              />
            </div>

            <motion.button
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              onClick={dismiss}
              style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.16)', color: '#fff',
                padding: '14px 30px', borderRadius: '100px', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
              }}
              whileHover={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.28)' }}
            >
              Entrar al sitio
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>

          {/* Barra de progreso */}
          <motion.div
            style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: '#E8118A', zIndex: 11, transformOrigin: 'left' }}
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: 12, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
