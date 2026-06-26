import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PHRASES = [
  { normal: 'más de 8 millones',       highlight: 'de personas al mes' },
  { normal: 'estudiantes, docentes,',  highlight: 'administrativos' },
  { normal: 'y padres',                highlight: 'de familia' },
]

const VIMEO_ID   = '1204931565'
const VIMEO_HASH = '2f09718362'

const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

export default function CinematicText() {
  const ref = useRef(null)
  const [isMobile, setIsMobile]   = useState(IS_MOBILE_INIT)
  const [showVideo, setShowVideo] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /*
   * Desktop: rootMargin 600px → el video preacarga antes de que el usuario llegue.
   * Móvil: rootMargin 0px → el video carga solo cuando la sección entra en viewport,
   * después de que el texto ya sea visible. Evita bloquear el render en móvil.
   */
  useEffect(() => {
    if (showVideo) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShowVideo(true); observer.disconnect() } },
      { rootMargin: isMobile ? '0px' : '600px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile, showVideo])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const op0 = useTransform(scrollYProgress, [0.00, 0.06, 0.27, 0.33], [0, 1, 1, 0])
  const y0  = useTransform(scrollYProgress, [0.00, 0.10], [32, 0])
  const op1 = useTransform(scrollYProgress, [0.33, 0.39, 0.60, 0.66], [0, 1, 1, 0])
  const y1  = useTransform(scrollYProgress, [0.33, 0.43], [32, 0])
  const op2 = useTransform(scrollYProgress, [0.66, 0.73, 0.94, 1.00], [0, 1, 1, 0])
  const y2  = useTransform(scrollYProgress, [0.66, 0.77], [32, 0])

  const layers = [
    { ...PHRASES[0], op: op0, yMotion: y0 },
    { ...PHRASES[1], op: op1, yMotion: y1 },
    { ...PHRASES[2], op: op2, yMotion: y2 },
  ]

  return (
    <div ref={ref} id="cinematic-outer" style={{ height: '300vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#0D0D0D', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* Video Vimeo como fondo — desktop preacarga, móvil carga al entrar */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
          {showVideo && (
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_ID}?h=${VIMEO_HASH}&background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 'max(100vw, 177.78vh)',
                height: 'max(100vh, 56.25vw)',
                transform: 'translate(-50%, -50%)',
                border: 'none',
                pointerEvents: 'none',
              }}
              title="Branding Media cifras"
            />
          )}
        </div>

        {/* Viñeta circular: centro semitransparente, bordes muy oscuros */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(circle 44vmin at 50% 50%, rgba(13,13,13,0.18) 0%, rgba(13,13,13,0.42) 40%, rgba(13,13,13,0.78) 65%, rgba(13,13,13,0.97) 90%)',
        }} />

        {/* Puntos en el área oscura */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle 40vmin at 50% 50%, transparent 0%, transparent 26%, black 60%)',
          WebkitMaskImage: 'radial-gradient(circle 40vmin at 50% 50%, transparent 0%, transparent 26%, black 60%)',
        }} />

        {/* Frases — una a la vez, controladas por scroll */}
        {layers.map((layer, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center',
              padding: '0 clamp(1.5rem, 8vw, 6rem)',
              zIndex: 5,
              opacity: layer.op,
              y: layer.yMotion,
              pointerEvents: 'none',
            }}
          >
            <span style={{
              display: 'block',
              fontSize: 'clamp(2.4rem, 6.5vw, 6rem)',
              fontWeight: 900,
              letterSpacing: '-0.06em',
              lineHeight: 1.0,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.6)',
            }}>
              {layer.normal}
            </span>
            <span style={{
              display: 'block',
              fontSize: 'clamp(2.4rem, 6.5vw, 6rem)',
              fontWeight: 900,
              letterSpacing: '-0.06em',
              lineHeight: 1.0,
              textTransform: 'uppercase',
              color: '#E8118A',
              textShadow: '0 2px 28px rgba(232,17,138,0.60), 0 0 60px rgba(0,0,0,0.5)',
            }}>
              {layer.highlight}
            </span>
          </motion.div>
        ))}

      </div>
    </div>
  )
}
