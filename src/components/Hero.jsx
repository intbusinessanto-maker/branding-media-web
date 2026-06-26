import { useState, useLayoutEffect } from 'react'

/*
 * YouTube en todos los dispositivos con playsinline=1 para móvil.
 * isDesktop se mantiene solo para las máscaras decorativas de esquina.
 * useLayoutEffect corrige la detección antes del primer paint.
 */
const IS_DESKTOP_INIT = typeof window !== 'undefined'
  ? !window.matchMedia('(max-width: 767px)').matches
  : true
const YT_ID = 'RShiy9dpewA'

export default function Hero({ videoActive = true }) {
  const [isDesktop, setIsDesktop] = useState(IS_DESKTOP_INIT)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsDesktop(!mq.matches)
    const handler = (e) => setIsDesktop(!e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section id="inicio" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 'clamp(120px, 14vh, 160px) 1.5rem 80px',
      position: 'relative', overflow: 'hidden',
      backgroundColor: '#0a0a0a',
      backgroundImage: `url(https://img.youtube.com/vi/${YT_ID}/hqdefault.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>

      {/* Video: YouTube en todos los dispositivos — playsinline=1 habilita autoplay en móvil */}
      {videoActive && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <iframe
            src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${YT_ID}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&origin=https://bmmedios.com`}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100vh * 1.7778)', height: '100vh',
              minWidth: '100%', border: 'none',
            }}
            allow="autoplay; encrypted-media"
            title=""
          />
        </div>
      )}

      {/* Gradiente de profundidad — solo móvil (fallback visual si iOS no hace autoplay) */}
      {!isDesktop && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 25% 30%, rgba(139,63,168,0.35) 0%, transparent 55%), rgba(0,0,0,0.45)',
        }} />
      )}

      {/* Overlay de legibilidad — ambas plataformas */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.62) 100%)',
      }} />

      {/* Cubre logo/controles de YouTube — solo desktop */}
      {isDesktop && <>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '220px', height: '80px',
          background: 'linear-gradient(to top left, rgba(0,0,0,0.98) 30%, transparent 100%)',
          pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '220px', height: '80px',
          background: 'linear-gradient(to top right, rgba(0,0,0,0.98) 30%, transparent 100%)',
          pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '180px', height: '60px',
          background: 'linear-gradient(to bottom left, rgba(0,0,0,0.98) 30%, transparent 100%)',
          pointerEvents: 'none', zIndex: 2 }} />
      </>}
    </section>
  )
}
