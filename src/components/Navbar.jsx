import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO_URL       = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png'
const LOGO_WHITE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo%20Branding%20Media%20(f%20blanco).png'

const links = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Cobertura', href: '#mapa' },
  { label: 'Formatos', href: '#formatos' },
  { label: 'Casos', href: '#casos' },
  { label: 'Blog', href: '#blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const [dark, setDark]         = useState(0)  // 0 = blanco, 1 = negro

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)

      /* Oscurecer gradualmente al entrar en la sección CinematicText (id="cinematic-outer") */
      const el = document.getElementById('cinematic-outer')
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const vh    = window.innerHeight
      const FADE  = 280  // px de transición suave antes/después

      let level = 0
      if (rect.top > vh || rect.bottom < 0) {
        level = 0                                              // fuera del viewport
      } else if (rect.top <= 0 && rect.bottom >= vh) {
        level = 1                                              // sección cubre todo el viewport
      } else if (rect.top > 0 && rect.top < FADE) {
        level = 1 - rect.top / FADE                           // entrando desde arriba
      } else if (rect.bottom > 0 && rect.bottom < FADE) {
        level = rect.bottom / FADE                            // saliendo por abajo
      }
      setDark(Math.max(0, Math.min(1, level)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
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
          backgroundColor: `rgba(${Math.round(255*(1-dark))},${Math.round(255*(1-dark))},${Math.round(255*(1-dark))},${dark > 0.05 ? 1 : 0.97})`,
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled && dark < 0.5 ? '1px solid rgba(0,0,0,0.08)' : `1px solid rgba(255,255,255,${dark * 0.12})`,
          transition: 'background-color 0.6s ease, border-color 0.5s ease',
        }}
      >
        {/* Logo — más grande */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
          onClick={closeMenu}>
          {/* Logo crossfade: color → blanco al oscurecer */}
          <div style={{ position: 'relative', height: '88px', display: 'flex', alignItems: 'center' }}>
            <img src={LOGO_URL} alt="Branding Media"
              style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block',
                opacity: 1 - dark, transition: 'opacity 0.6s ease', position: 'relative', zIndex: 1 }} />
            <img src={LOGO_WHITE_URL} alt="Branding Media"
              style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block',
                opacity: dark, transition: 'opacity 0.6s ease',
                position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }} />
          </div>
        </a>

        {/* Desktop nav */}
        <nav style={{
          display: 'flex', gap: '2rem', alignItems: 'center',
        }} className="nav-desktop">
          {links.map(link => {
            const linkColor = dark > 0.5 ? 'rgba(255,255,255,0.7)' : '#555'
            const hoverColor = dark > 0.5 ? '#fff' : '#1A1A1A'
            return (
              <a key={link.href} href={link.href} style={{
                color: linkColor, textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                transition: 'color 0.5s',
              }}
                onMouseEnter={e => e.target.style.color = hoverColor}
                onMouseLeave={e => e.target.style.color = linkColor}
              >{link.label}</a>
            )
          })}
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
            style={{ display: 'block', width: '22px', height: '2px', background: dark > 0.5 ? '#fff' : '#1A1A1A', borderRadius: '2px', transformOrigin: 'center', transition: 'background 0.5s' }} />
          <motion.span animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
            style={{ display: 'block', width: '22px', height: '2px', background: dark > 0.5 ? '#fff' : '#1A1A1A', borderRadius: '2px', transition: 'background 0.5s' }} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
            style={{ display: 'block', width: '22px', height: '2px', background: dark > 0.5 ? '#fff' : '#1A1A1A', borderRadius: '2px', transformOrigin: 'center', transition: 'background 0.5s' }} />
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
              backgroundColor: 'rgba(255,255,255,0.98)',
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


