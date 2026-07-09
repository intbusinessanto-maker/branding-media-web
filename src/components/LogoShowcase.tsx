import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ESLOGAN_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/eslogan.webp'
const FONDO_URL    = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'

/* Burbujas ordenadas por tamaño: LinkedIn > Instagram > Facebook > TikTok > WhatsApp */
const SOCIALS = [
  {
    id: 'linkedin', label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/bmmedios/',
    bg: '#0A66C2',
    size: 'clamp(100px, 12vw, 144px)',
    pos: { top: '10%', right: '24%' }, floatDur: 5.9, floatDelay: '0.6s',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'58%', height:'58%' }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    id: 'instagram', label: 'Instagram',
    href: 'https://www.instagram.com/brandingmedialatam?igsh=b2dnc2h0YWw4ODd6',
    bg: 'linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    size: 'clamp(88px, 10vw, 120px)',
    pos: { top: '10%', left: '24%' }, floatDur: 5.4, floatDelay: '0s',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'55%', height:'55%' }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  {
    id: 'facebook', label: 'Facebook',
    href: 'https://www.facebook.com/share/1DLmKB2DB7/',
    bg: '#1877F2',
    size: 'clamp(76px, 8.5vw, 104px)',
    pos: { top: '64%', left: '22%' }, floatDur: 6.3, floatDelay: '1.2s',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'52%', height:'52%' }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    id: 'tiktok', label: 'TikTok',
    href: undefined,
    bg: '#010101',
    size: 'clamp(68px, 7.5vw, 92px)',
    pos: { top: '66%', right: '22%' }, floatDur: 6.8, floatDelay: '1.8s',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'48%', height:'48%' }}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
  },
  {
    id: 'whatsapp', label: 'WhatsApp',
    href: 'https://wa.me/573001556010',
    bg: '#25D366',
    size: 'clamp(68px, 7.5vw, 92px)',
    pos: { top: '40%', right: '20%' }, floatDur: 7.2, floatDelay: '2.4s',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width:'48%', height:'48%' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
]

interface Social { id: string; label: string; href?: string; bg: string; size: string; pos: Record<string, string | undefined>; floatDur: number; floatDelay: string; icon: React.ReactNode }
import type React from 'react'
function SocialBubble({ s, i }: { s: Social; i: number }) {
  const circle = (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: s.href ? 1 : 0.38, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={s.href ? { scale: 1.12 } : {}}
      transition={{ delay: 0.3 + i * 0.12, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        width: s.size, height: s.size, borderRadius: '50%',
        background: s.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 10px 36px rgba(0,0,0,0.25)',
        cursor: s.href ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {s.icon}
    </motion.div>
  )

  const wrapStyle: React.CSSProperties = {
    position: 'absolute', zIndex: 3,
    ...(s.pos as React.CSSProperties),
    animation: `bfloat ${s.floatDur}s ease-in-out infinite`,
    animationDelay: s.floatDelay,
  }

  return s.href ? (
    <a href={s.href} target="_blank" rel="noopener noreferrer"
      className={`social-bubble social-${s.id}`}
      style={{ ...wrapStyle, textDecoration: 'none' }}>
      {circle}
    </a>
  ) : (
    <div className={`social-bubble social-${s.id}`} style={wrapStyle}>{circle}</div>
  )
}

export default function LogoShowcase() {
  const ref = useRef(null)
  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 70, damping: 22 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 70, damping: 22 })

  useEffect(() => {
    const el = ref.current as HTMLElement | null
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set((e.clientX - r.left)  / r.width  - 0.5)
      my.set((e.clientY - r.top)   / r.height - 0.5)
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
    <section ref={ref} className="logo-showcase-section" style={{
      height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', background: 'transparent',
    }}>
      <style>{`
        @keyframes bfloat {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-16px); }
        }
        /* ── Móvil: redes ARRIBA y ABAJO del eslogan ── */
        @media (max-width: 767px) {
          .logo-showcase-section {
            background-image: url(${FONDO_URL}) !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
          }
          .social-bubble { animation-duration: 5s !important; }

          /* === FILA SUPERIOR === */
          /* LinkedIn — arriba izquierda, el más grande y prominente */
          .social-linkedin { top: 28% !important; left: 2% !important; right: auto !important; }
          .social-linkedin > div { width: 108px !important; height: 108px !important; }

          /* Instagram — arriba derecha, un poco más arriba que LinkedIn y más pequeño */
          .social-instagram { top: 22% !important; left: auto !important; right: 2% !important; }
          .social-instagram > div { width: 88px !important; height: 88px !important; }

          /* === FILA INFERIOR — justo debajo del logo === */
          /* Facebook — abajo izquierda */
          .social-facebook { top: 62% !important; left: 4% !important; right: auto !important; }
          .social-facebook > div { width: 80px !important; height: 80px !important; }

          /* WhatsApp — abajo centro, pegado al logo */
          .social-whatsapp { top: 60% !important; left: 50% !important; right: auto !important; transform: translateX(-50%) !important; }
          .social-whatsapp > div { width: 104px !important; height: 104px !important; }

          /* TikTok — abajo derecha, el más pequeño */
          .social-tiktok { top: 63% !important; left: auto !important; right: 4% !important; }
          .social-tiktok > div { width: 64px !important; height: 64px !important; }
        }
      `}</style>


      {/* Burbujas de redes sociales */}
      {SOCIALS.map((s, i) => <SocialBubble key={s.id} s={s} i={i} />)}

      {/* Eslogan con tilt 3D + float */}
      <motion.div
        initial={{ opacity: 0, scale: 0.72, y: 36 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position:'relative', zIndex:2, transformPerspective:1200, rotateX, rotateY }}
      >
        <motion.img
          src={ESLOGAN_URL}
          alt="Movemos marcas en universidades"
          draggable={false}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 'clamp(220px, 52vw, 600px)',
            height: 'auto', objectFit: 'contain', display: 'block',
            filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.13)) drop-shadow(0 6px 14px rgba(0,0,0,0.07))',
            userSelect: 'none',
          }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </motion.div>
    </section>
  )
}
