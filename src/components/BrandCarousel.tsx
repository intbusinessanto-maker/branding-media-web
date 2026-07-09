import { useEffect, useState, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const BUCKET = 'Imagenes para la web'
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'avif']
const FONDO_URL = `https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/${encodeURIComponent(BUCKET)}/Fondo%202.png`

const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

interface BrandImage { name: string; url: string }

function isImage(name: string) {
  return IMAGE_EXTS.some(ext => name.toLowerCase().endsWith(`.${ext}`))
}

function publicUrl(name: string) {
  return `https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/${encodeURIComponent(BUCKET)}/${encodeURIComponent(name)}`
}

export default function BrandCarousel() {
  const [images, setImages] = useState<BrandImage[]>([])
  const [hovered, setHovered] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(IS_MOBILE_INIT)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    supabase.storage.from(BUCKET).list('', { limit: 100 })
      .then(({ data }) => {
        if (!data) return
        const imgs = data
          .filter(f => isImage(f.name) && f.name !== 'Logo-Branding-Media.png')
          .map(f => ({ name: f.name.replace(/\.[^.]+$/, ''), url: publicUrl(f.name) }))
        setImages(imgs)
      })
  }, [])

  const sectionBg = isMobile
    ? { backgroundImage: `url(${FONDO_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
    : { background: 'transparent' }

  /* No retornar null — causa layout shift de 0→800px cuando carga Supabase,
     desplazando CinematicText y rompiendo su scroll tracking. */
  if (images.length === 0) return (
    <section style={{
      padding: '80px 2rem',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      minHeight: '200px',
      ...sectionBg,
    }} />
  )

  return (
    <section style={{
      padding: '80px 2rem',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      ...sectionBg,
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '52px' }}
        >
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#AAA', marginBottom: '10px',
          }}>
            Marcas que han confiado en nosotros
          </p>
          <div style={{
            width: '40px', height: '3px', margin: '0 auto',
            background: '#00C4AD',
            borderRadius: '2px',
          }} />
        </motion.div>

        {/* Grid con stagger — logos aparecen al hacer scroll */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}>
          {images.map((img, i) => (
            <motion.div
              key={img.name}
              initial={{ opacity: 0, scale: 0.75, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: (i % 6) * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '20px 16px 28px',
                borderRadius: '12px',
                background: hovered === i ? '#FAFAFA' : '#fff',
                border: `1px solid ${hovered === i ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: hovered === i ? '0 8px 28px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'default',
                transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                minHeight: '90px',
              }}
            >
              <img
                src={img.url}
                alt={img.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '44px',
                  objectFit: 'contain',
                  filter: hovered === i ? 'grayscale(0)' : 'grayscale(1) opacity(0.55)',
                  transition: 'filter 0.3s',
                }}
                onError={e => { const p = (e.target as HTMLImageElement).parentElement; if (p) p.style.display = 'none' }}
              />

              {/* Nombre aparece al hover */}
              <motion.span
                animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 4 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: '11px', fontWeight: 600, color: '#888',
                  letterSpacing: '0.04em', textAlign: 'center',
                  position: 'absolute', bottom: '8px',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis', maxWidth: '90%',
                }}
              >
                {img.name}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
