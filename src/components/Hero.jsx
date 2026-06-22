import { useState, useEffect } from 'react'

const VIDEO_ID = '68paHyhJHPU'

export default function Hero({ videoActive = true }) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])
  return (
    <section id="inicio" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 'clamp(120px, 14vh, 160px) 1.5rem 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Fondo base */}
      <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', pointerEvents: 'none' }} />

      {/* Móvil: gradiente visual ya que YouTube no hace autoplay en iOS/Android */}
      {!isDesktop && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 25% 30%, rgba(139,63,168,0.45) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(0,196,173,0.25) 0%, transparent 55%)' }} />
      )}

      {/* Video fondo YouTube — solo desktop */}
      {videoActive && isDesktop && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1`}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'calc(100vh * 1.7778)',
              height: '100vh',
              minWidth: '100%',
              border: 'none',
            }}
            allow="autoplay; encrypted-media"
            title=""
          />
        </div>
      )}

      {/* Overlay oscuro gradiente para legibilidad */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.62) 100%)',
      }} />

      {/* Cubre el logo de YouTube (esquina inferior derecha) y cualquier texto del player */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: '220px', height: '80px',
        background: 'linear-gradient(to top left, rgba(0,0,0,0.98) 30%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '220px', height: '80px',
        background: 'linear-gradient(to top right, rgba(0,0,0,0.98) 30%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '180px', height: '60px',
        background: 'linear-gradient(to bottom left, rgba(0,0,0,0.98) 30%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

    </section>
  )
}
