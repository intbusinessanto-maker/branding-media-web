import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          padding: '0 1.5rem',
          height: '88px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: scrolled || open ? 'rgba(233,233,233,0.97)' : 'rgba(233,233,233,0.80)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo — más grande */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
          onClick={closeMenu}>
          <img
            src={LOGO_URL}
            alt="Branding Media"
            style={{ height: '88px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </a>

        {/* Desktop nav */}
        <nav style={{
          display: 'flex', gap: '2rem', alignItems: 'center',
          // Oculto en móvil via media query inline — usamos clase CSS
        }} className="nav-desktop">
          {links.map(link => (
            <a key={link.href} href={link.href} style={{
              color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#1A1A1A'}
              onMouseLeave={e => e.target.style.color = '#555'}
            >{link.label}</a>
          ))}
          <a href="#contacto" style={{
            background: '#8B3FA8',
            color: '#fff', padding: '11px 24px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0,196,173,0.25)', whiteSpace: 'nowrap',
          }}>
            Contactar
          </a>
        </nav>

        {/* Botón hamburguesa — solo móvil */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'none', // controlado por CSS
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', borderRadius: '8px',
            flexDirection: 'column', gap: '5px',
            alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Menú"
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
            style={{ display: 'block', width: '22px', height: '2px', background: '#1A1A1A', borderRadius: '2px', transformOrigin: 'center' }} />
          <motion.span animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
            style={{ display: 'block', width: '22px', height: '2px', background: '#1A1A1A', borderRadius: '2px' }} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
            style={{ display: 'block', width: '22px', height: '2px', background: '#1A1A1A', borderRadius: '2px', transformOrigin: 'center' }} />
        </button>
      </motion.header>

      {/* Menú móvil — overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: '88px', left: 0, right: 0, bottom: 0,
              zIndex: 190,
              backgroundColor: 'rgba(233,233,233,0.98)',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              padding: '32px 1.5rem 40px',
              gap: '8px',
              overflowY: 'auto',
            }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                onClick={closeMenu}
                style={{
                  color: '#1A1A1A', textDecoration: 'none',
                  fontSize: '24px', fontWeight: 700,
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  letterSpacing: '-0.02em',
                }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="#contacto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              onClick={closeMenu}
              style={{
                marginTop: '24px',
                background: '#8B3FA8',
                color: '#fff', padding: '16px 24px', borderRadius: '12px',
                fontSize: '16px', fontWeight: 700, textDecoration: 'none',
                textAlign: 'center',
                boxShadow: '0 6px 20px rgba(0,196,173,0.3)',
              }}
            >
              Contactar
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos responsive */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .nav-desktop { display: flex !important; }
        }
      `}</style>
    </>
  )
}


