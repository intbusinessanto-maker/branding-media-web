const LOGO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo%20Branding%20Media%20(f%20blanco).png'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/brandingmedialatam?igsh=b2dnc2h0YWw4ODd6',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1DLmKB2DB7/',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/bmmedios/',
    color: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: null,
    color: '#010101',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
]

const NAV_LINKS = [
  { label: 'OOH',          href: '#formatos',  color: '#E8118A' },
  { label: 'DOOH',         href: '#formatos',  color: '#00C4AD' },
  { label: 'Universidades',href: '#mapa',      color: '#8B3FA8' },
  { label: 'Blog',         href: '#blog',      color: '#00C4AD' },
  { label: 'Contacto',     href: '#contacto',  color: '#E8118A' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A', padding: '60px 2rem 32px' }}>

      {/* Línea gradiente top */}
      <div style={{ display: 'flex', marginBottom: '48px' }}>
        <div style={{ flex: 1, height: '3px', background: '#8B3FA8', borderRadius: '2px 0 0 2px' }} />
        <div style={{ flex: 1, height: '3px', background: '#00C4AD' }} />
        <div style={{ flex: 1, height: '3px', background: '#E8118A', borderRadius: '0 2px 2px 0' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Fila principal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>

          {/* Logo + eslogan breve */}
          <div>
            <img src={LOGO_URL} alt="Branding Media" style={{ height: 'clamp(80px, 10vw, 120px)', width: 'auto', objectFit: 'contain', marginBottom: '14px', display: 'block' }} />
            <p style={{ fontSize: '12px', color: '#AAA', maxWidth: '240px', lineHeight: 1.6 }}>
              El circuito universitario más grande de Colombia.
            </p>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: '2px' }}>Sitio</span>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                style={{ fontSize: '13px', color: '#AAA', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = l.color}
                onMouseLeave={e => e.target.style.color = '#AAA'}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Redes sociales */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '14px' }}>Síguenos</span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {SOCIALS.map(s => {
                const inner = (
                  <div
                    key={s.label}
                    title={s.href ? s.label : `${s.label} — Próximamente`}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: s.href ? s.color : '#333',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff',
                      opacity: s.href ? 1 : 0.4,
                      cursor: s.href ? 'pointer' : 'default',
                      transition: 'transform 0.2s, opacity 0.2s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { if (s.href) e.currentTarget.style.transform = 'scale(1.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    {s.icon}
                  </div>
                )
                return s.href ? (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    {inner}
                  </a>
                ) : inner
              })}
            </div>
          </div>

        </div>

        {/* Línea divisoria */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

        {/* Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: '#AAA' }}>
            Copyright ©2026 – All rights reserved. Powered by{' '}
            <a href="https://dangerdigitalagency.com/" target="_blank" rel="noopener noreferrer"
              style={{ color: '#E8118A', textDecoration: 'none', fontWeight: 700 }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}>
              Danger
            </a>
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>Movemos marcas en universidades</p>
        </div>

      </div>
    </footer>
  )
}
