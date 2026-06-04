import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LOGO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png'

const links = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Cobertura', href: '#mapa' },
  { label: 'Formatos', href: '#formatos' },
  { label: 'Casos', href: '#casos' },
  { label: 'Blog', href: '#blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '0 2.5rem',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        /* Header siempre oscuro — el logo se ve sobre fondo consistente */
        backgroundColor: scrolled ? '#0A0A0A' : 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1E1E1E',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Logo directo del storage, sin filtros */}
      <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img
          src={LOGO_URL}
          alt="Branding Media"
          style={{
            height: '80px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            imageRendering: 'auto',
          }}
        />
      </a>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{
              color: '#888',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = '#888'}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contacto"
          style={{
            backgroundColor: '#00C4AD',
            color: '#0A0A0A',
            padding: '11px 22px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          Contactar
        </a>
      </nav>
    </motion.header>
  )
}
