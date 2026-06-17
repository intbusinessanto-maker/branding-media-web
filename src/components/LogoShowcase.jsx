import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const LOGO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png'

export default function LogoShowcase() {
  const ref = useRef(null)
  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)

  /* 3D tilt suave al mover el mouse — vuelve al centro al salir */
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 70, damping: 22 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 70, damping: 22 })

  useEffect(() => {
    const el = ref.current
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top)  / r.height - 0.5)
    }
    const onLeave = () => { mx.set(0); my.set(0) }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section
      ref={ref}
      style={{
        height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', background: 'transparent',
      }}
    >
      <style>{`
        /* Morfología orgánica de los blobs */
        @keyframes morph1 {
          0%,100% { border-radius: 62% 38% 55% 45% / 52% 48% 58% 42%; }
          25%      { border-radius: 38% 62% 42% 58% / 68% 32% 58% 42%; }
          50%      { border-radius: 55% 45% 62% 38% / 38% 62% 42% 58%; }
          75%      { border-radius: 45% 55% 38% 62% / 58% 42% 62% 38%; }
        }
        @keyframes morph2 {
          0%,100% { border-radius: 45% 55% 62% 38% / 58% 42% 55% 45%; }
          33%      { border-radius: 62% 38% 42% 58% / 38% 62% 45% 55%; }
          66%      { border-radius: 38% 62% 55% 45% / 62% 38% 58% 42%; }
        }
        /* Drift — movimiento lento de los blobs */
        @keyframes drift1 {
          0%,100% { transform: translate(0px,    0px); }
          50%      { transform: translate(28px,  -22px); }
        }
        @keyframes drift2 {
          0%,100% { transform: translate(0px,    0px); }
          50%      { transform: translate(-22px,  18px); }
        }
        /* Float del logo */
        @keyframes logoFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
      `}</style>

      {/* ── Blob teal — arriba-izquierda ── */}
      <div style={{
        position: 'absolute',
        width:  'clamp(260px, 44vw, 540px)',
        height: 'clamp(260px, 44vw, 540px)',
        top: '12%', left: '8%',
        background: 'radial-gradient(circle, rgba(0,196,173,0.30) 0%, rgba(0,196,173,0.10) 55%, transparent 75%)',
        filter: 'blur(52px)',
        animation: 'morph1 11s ease-in-out infinite, drift1 15s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Blob fuchsia — abajo-derecha ── */}
      <div style={{
        position: 'absolute',
        width:  'clamp(220px, 38vw, 480px)',
        height: 'clamp(220px, 38vw, 480px)',
        bottom: '10%', right: '8%',
        background: 'radial-gradient(circle, rgba(232,17,138,0.26) 0%, rgba(232,17,138,0.08) 55%, transparent 75%)',
        filter: 'blur(56px)',
        animation: 'morph2 14s ease-in-out infinite, drift2 12s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Blob teal pequeño — abajo-izquierda (acento) ── */}
      <div style={{
        position: 'absolute',
        width:  'clamp(120px, 20vw, 280px)',
        height: 'clamp(120px, 20vw, 280px)',
        bottom: '18%', left: '14%',
        background: 'radial-gradient(circle, rgba(0,196,173,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'morph2 17s ease-in-out infinite reverse, drift2 19s ease-in-out infinite reverse',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Logo con tilt 3D + float ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.72, y: 36 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 2,
          transformPerspective: 1200,
          rotateX, rotateY,
        }}
      >
        <motion.img
          src={LOGO_URL}
          alt="Branding Media"
          draggable={false}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 'clamp(180px, 50vw, 520px)',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.13)) drop-shadow(0 6px 14px rgba(0,0,0,0.07))',
            userSelect: 'none',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </motion.div>
    </section>
  )
}
