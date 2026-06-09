const LOGO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png'

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A', padding: '60px 2rem 40px' }}>
      {/* Línea gradiente */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #8B3FA8, #00C4AD, #F07B00)', marginBottom: '48px', borderRadius: '2px', opacity: 0.8 }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <img src={LOGO_URL} alt="Branding Media" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
        <p style={{ fontSize: '13px', color: '#555' }}>© 2026 Branding Media · Bogotá, Colombia</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'OOH', color: '#F07B00' },
            { label: 'DOOH', color: '#00C4AD' },
            { label: 'Universidades', color: '#8B3FA8' },
            { label: 'Blog', color: '#00C4AD' },
            { label: 'Contacto', color: '#F07B00' },
          ].map(l => (
            <a key={l.label} href="#" style={{ fontSize: '13px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = l.color}
              onMouseLeave={e => e.target.style.color = '#555'}>{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}


