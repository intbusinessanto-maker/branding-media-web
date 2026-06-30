import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO    = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo%20Branding%20Media%20(f%20blanco).png'
const ESLOGAN = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/eslogan.webp'

/*
 * useLayoutEffect corrige la detección móvil antes del primer paint.
 * isMobileRef permite que el useEffect lea el valor correcto sin depender
 * del cierre de estado (que capturaría el valor del primer render).
 */
const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

export default function VideoIntro({ onDismiss }) {
  const [visible, setVisible]   = useState(true)
  const [isMobile, setIsMobile] = useState(IS_MOBILE_INIT)
  const isMobileRef             = useRef(IS_MOBILE_INIT)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    isMobileRef.current = mq.matches
    setIsMobile(mq.matches)
  }, [])

  const dismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 600)
  }

  useEffect(() => {
    /* Scroll lock robusto — funciona en iOS Safari donde overflow:hidden solo no basta */
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top      = `-${scrollY}px`
    document.body.style.width    = '100%'

    const t = setTimeout(dismiss, isMobileRef.current ? 7000 : 12000)

    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const progressDuration = isMobile ? 8 : 12

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden', touchAction: 'none',
            backgroundColor: '#000',
            backgroundImage: 'url(https://img.youtube.com/vi/RShiy9dpewA/hqdefault.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* YouTube en todos los dispositivos — playsinline=1 para autoplay en móvil */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <iframe
              src="https://www.youtube.com/embed/RShiy9dpewA?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=RShiy9dpewA&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&origin=https://bmmedios.com"
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

          {/* ── Gradientes — desktop tiene capa oscura, móvil usa el bg gradient ── */}
          {!isMobile && (
            <>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.78) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.2) 100%)' }} />
            </>
          )}
          {isMobile && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent 40%, rgba(8,8,16,0.85) 75%)' }} />
          )}

          {/* ── Logo — sin delay en móvil para visibilidad inmediata ── */}
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isMobile ? 0 : 0.8, duration: isMobile ? 0.3 : 0.5 }}
            style={{ position: 'absolute', top: isMobile ? '24px' : '28px',
              left: isMobile ? '20px' : '36px', zIndex: 10 }}
          >
            <img src={LOGO} alt="Branding Media"
              style={{ height: isMobile ? 'clamp(52px, 14vw, 72px)' : 'clamp(72px, 10vw, 110px)', objectFit: 'contain' }} />
          </motion.div>

          {/* ── Contenido inferior — siempre anclado a bottom, nunca requiere scroll ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
            padding: isMobile
              ? '0 20px max(28px, env(safe-area-inset-bottom, 28px))'
              : 'clamp(20px,4vw,44px) clamp(20px,5vw,48px)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: isMobile ? 'flex-end' : 'space-between',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            gap: isMobile ? '16px' : '20px',
          }}>
            {/* Eslogan + tag — fila, tag a la derecha del eslogan, ambos anclados abajo */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: isMobile ? '12px' : '20px' }}>
              <img src={ESLOGAN} alt="Movemos marcas en universidades"
                style={{
                  height: isMobile ? 'clamp(34px, 7.5vw, 48px)' : 'clamp(52px, 10vw, 120px)',
                  width: 'auto', maxWidth: isMobile ? '46vw' : '50vw',
                  objectFit: 'contain', objectPosition: 'left center', display: 'block',
                  filter: 'drop-shadow(0 2px 18px rgba(0,0,0,0.9))',
                  flexShrink: 0,
                }}
              />
              <p style={{
                color: 'rgba(255,255,255,0.55)', fontSize: isMobile ? '9px' : '10px',
                letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
                lineHeight: 1.5, margin: 0, marginBottom: isMobile ? '2px' : '4px',
                maxWidth: isMobile ? '40vw' : '220px',
              }}>
                Circuito de pauta dentro de las universidades más grandes de Latinoamérica
              </p>
            </div>

            <button
              onClick={dismiss}
              style={{
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.22)', color: '#fff',
                padding: isMobile ? '13px 28px' : '14px 30px',
                borderRadius: '100px',
                fontSize: isMobile ? '14px' : '14px', fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '10px',
                alignSelf: isMobile ? 'flex-end' : undefined,
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
