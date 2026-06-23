import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STATUE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/estatua_y_publico-removebg-preview%20(1)%20(1).png'
const VIMEO_ID   = '1201924875'

const PHRASES = [
  { normal: 'el futuro de tu',     highlight: 'marca es aquí' },
  { normal: 'público constante,',  highlight: 'atención real' },
  { normal: 'la nueva generación', highlight: 'ya está aquí' },
]

const IS_MOBILE_CT = typeof window !== 'undefined' && window.innerWidth < 768

export default function CinematicText() {
  const ref = useRef(null)
  const [showVideo, setShowVideo] = useState(false)

  /* Cargar el iframe solo en desktop y cuando la sección entra en pantalla.
     En móvil no cargamos Vimeo — mejora carga y el video no puede hacer autoplay en iOS. */
  useEffect(() => {
    if (IS_MOBILE_CT) return          // móvil: sin iframe
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShowVideo(true); observer.disconnect() } },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ── Progreso de scroll → activa las frases ── */
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
    /* Contenedor 300vh — da espacio de scroll para las 3 frases */
    <div ref={ref} style={{ height: '300vh', position: 'relative' }}>

      {/* Sección sticky — siempre visible mientras el usuario baja */}
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#0D0D0D', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>

        {/* ① Video Vimeo — se carga solo cuando la sección entra en vista */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
          {showVideo && (
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0&quality=auto`}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(100vh * 1.7778)',
                height: '100vh',
                minWidth: '100%',
                minHeight: '100%',
                border: 'none',
              }}
              allow="autoplay; fullscreen; picture-in-picture"
              title=""
            />
          )}
        </div>

        {/* ② Viñeta circular — centro semitransparente, bordes muy oscuros */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(circle 44vmin at 50% 50%, rgba(13,13,13,0.18) 0%, rgba(13,13,13,0.42) 40%, rgba(13,13,13,0.78) 65%, rgba(13,13,13,0.97) 90%)',
        }} />

        {/* ③ Puntos — solo en el área oscura alrededor del foco */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle 40vmin at 50% 50%, transparent 0%, transparent 26%, black 60%)',
          WebkitMaskImage: 'radial-gradient(circle 40vmin at 50% 50%, transparent 0%, transparent 26%, black 60%)',
        }} />

        {/* ④ Imagen estatua — eliminada, el video de fondo se ve en todos los tamaños */}

        {/* ⑤ Frases — una a la vez, controladas por scroll */}
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
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.6)',
            }}>
              {layer.normal}
            </span>
            <span style={{
              display: 'block',
              fontSize: 'clamp(2.4rem, 6.5vw, 6rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
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
