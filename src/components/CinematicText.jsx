import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/*
 * Imágenes que el usuario debe subir a Supabase con estos nombres exactos:
 *   - campus-personas-caminando.jpg  (personas con blur de movimiento, imagen 1)
 *   - estatua-silueta.png            (estatua recortada sin fondo, imagen 1)
 */
const CAMPUS_BG   = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/campus-personas-caminando.jpg'
const STATUE_URL  = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/estatua-silueta.png'

const PHRASES = [
  { parts: ['el futuro de tu ', 'marca es aquí',    ''] },
  { parts: ['público constante, ', 'atención real', ''] },
  { parts: ['la nueva generación ', 'ya está aquí', ''] },
]

export default function CinematicText() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const statueY       = useTransform(scrollYProgress, [0, 1], [80, -80])
  const statueOpacity = useTransform(scrollYProgress, [0, 0.12, 0.78, 1], [0, 1, 1, 0])
  const statueScale   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.88, 1, 1, 0.88])

  return (
    <section
      ref={ref}
      style={{
        background: '#0D0D0D',
        padding: 'clamp(100px, 14vw, 160px) clamp(1.5rem, 7vw, 8rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fondo campus (se activa cuando el usuario sube el archivo) */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url(${CAMPUS_BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        opacity: 0.07, filter: 'grayscale(1) contrast(1.2)',
      }} />

      {/* Patrón de puntos sobre el fondo oscuro */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.032) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Vignette lateral izquierda */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%',
        background: 'linear-gradient(to right, rgba(13,13,13,0.6) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Silueta estatua — derecha, scroll parallax */}
      <motion.div
        style={{
          position: 'absolute',
          right: 'clamp(16px, 5vw, 60px)',
          bottom: 0,
          y: statueY,
          opacity: statueOpacity,
          scale: statueScale,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <img
          src={STATUE_URL}
          alt=""
          style={{
            height: 'clamp(280px, 52vh, 500px)',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1) opacity(0.14)',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </motion.div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '14px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
          }}>
            <span style={{ width: '36px', height: '1.5px', background: '#E8118A', display: 'inline-block', borderRadius: '2px' }} />
            Branding Media
          </span>
        </motion.div>

        {/* Frases con palabras clave destacadas */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PHRASES.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -56 : 56 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
              style={{
                fontSize: 'clamp(2rem, 5.5vw, 4.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.04,
                padding: 'clamp(0.8rem, 1.8vw, 1.6rem) 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{p.parts[0]}</span>
              <span style={{ color: '#E8118A' }}>{p.parts[1]}</span>
              {p.parts[2] && <span style={{ color: 'rgba(255,255,255,0.55)' }}>{p.parts[2]}</span>}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.7 }}
          style={{
            marginTop: 'clamp(48px, 8vw, 88px)',
            display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap',
          }}
        >
          <a
            href="#contacto"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: '#E8118A', color: '#fff',
              padding: '15px 34px', borderRadius: '100px',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(232,17,138,0.32)',
              transition: 'transform 0.22s, box-shadow 0.22s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 16px 44px rgba(232,17,138,0.44)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(232,17,138,0.32)'
            }}
          >
            Activar campaña
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>
            Propuesta en menos de 24 horas
          </span>
        </motion.div>
      </div>
    </section>
  )
}
