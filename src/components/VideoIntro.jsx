import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO    = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo%20Branding%20Media%20(f%20blanco).png'
const ESLOGAN = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/eslogan.webp'

/* Detecta móvil de forma síncrona — evita render innecesario del iframe en iOS/Android */
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

export default function VideoIntro({ onDismiss }) {
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 600)
  }

  useEffect(() => {
    /* Bloquear scroll del body mientras el intro está visible */
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(dismiss, IS_MOBILE ? 7000 : 12000)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [])

  const progressDuration = IS_MOBILE ? 8 : 12

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
            background: IS_MOBILE
              ? 'radial-gradient(ellipse at 25% 20%, rgba(139,63,168,0.55) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(232,17,138,0.40) 0%, transparent 55%), #080810'
              : '#000',
          }}
        >
          {/* ── Video YouTube — solo desktop (iOS/Android bloquean autoplay) ── */}
          {!IS_MOBILE && (
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
          )}

          {/* ── Gradientes — desktop tiene capa oscura, móvil usa el bg gradient ── */}
          {!IS_MOBILE && (
            <>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.78) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.2) 100%)' }} />
            </>
          )}
          {IS_MOBILE && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.85) 75%)' }} />
          )}

          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: IS_MOBILE ? 0.1 : 0.8, duration: 0.5 }}
            style={{ position: 'absolute', top: IS_MOBILE ? '24px' : '28px',
              left: IS_MOBILE ? '20px' : '36px', zIndex: 10 }}
          >
            <img src={LOGO} alt="Branding Media"
              style={{ height: IS_MOBILE ? 'clamp(52px, 14vw, 72px)' : 'clamp(72px, 10vw, 110px)', objectFit: 'contain' }} />
          </motion.div>

          {/* ── Contenido inferior — siempre anclado a bottom, nunca requiere scroll ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
            padding: IS_MOBILE
              ? '0 20px max(28px, env(safe-area-inset-bottom, 28px))'
              : 'clamp(20px,4vw,44px) clamp(20px,5vw,48px)',
            display: 'flex',
            flexDirection: IS_MOBILE ? 'column' : 'row',
            justifyContent: IS_MOBILE ? 'flex-end' : 'space-between',
            alignItems: IS_MOBILE ? 'flex-start' : 'flex-end',
            gap: IS_MOBILE ? '16px' : '20px',
          }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                El circuito universitario más grande de Colombia
              </p>
              <img src={ESLOGAN} alt="Movemos marcas en universidades"
                style={{
                  height: IS_MOBILE ? 'clamp(36px, 8vw, 52px)' : 'clamp(52px, 10vw, 120px)',
                  width: 'auto', maxWidth: '78vw',
                  objectFit: 'contain', objectPosition: 'left center', display: 'block',
                  filter: 'drop-shadow(0 2px 18px rgba(0,0,0,0.9))',
                }}
              />
            </div>

            <button
              onClick={dismiss}
              style={{
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.22)', color: '#fff',
                padding: IS_MOBILE ? '13px 28px' : '14px 30px',
                borderRadius: '100px',
                fontSize: IS_MOBILE ? '14px' : '14px', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '10px',
                alignSelf: IS_MOBILE ? 'flex-end' : undefined,
              }}
            >
              Entrar al sitio
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* ── Barra de progreso ── */}
          <motion.div
            style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', background: '#E8118A', zIndex: 11, transformOrigin: 'left' }}
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: progressDuration, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
