import { motion } from 'framer-motion'

const LOGO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png'

const categoryColors = { Estrategia: '#8B3FA8', DOOH: '#00C4AD', Tendencias: '#E8118A' }

const posts = [
  {
    date: '03 Mar 2026', category: 'Estrategia',
    title: '¿Tu marca es protagonista o solo parte del paisaje?',
    excerpt: 'Estamos pagando fortunas por ser ignorados. El fin de la publicidad invisible en entornos universitarios.',
    readTime: '5 min',
  },
  {
    date: 'Próximamente', category: 'DOOH',
    title: 'Programmatic DOOH en universidades: la próxima frontera',
    excerpt: 'Cómo la compra programática de espacios digitales en campus está cambiando la planificación de medios.',
    readTime: '7 min',
  },
  {
    date: 'Próximamente', category: 'Tendencias',
    title: 'El universitario colombiano: el consumidor más valioso',
    excerpt: 'Datos, comportamientos y por qué las marcas más inteligentes ya están invirtiendo en este segmento.',
    readTime: '6 min',
  },
]

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header de la página */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '0 2rem', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={LOGO_URL} alt="Branding Media" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
        </a>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Inicio</a>
          <a href="/#mapa" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Cobertura</a>
          <a href="/#contacto" style={{
            background: '#8B3FA8', color: '#fff', padding: '9px 20px', borderRadius: '8px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
          }}>Contactar</a>
        </nav>
      </header>

      {/* Hero del blog */}
      <section style={{
        background: 'linear-gradient(135deg, #F8F0FF 0%, #F0FFFE 100%)',
        padding: 'clamp(60px,10vw,100px) 2rem clamp(40px,8vw,80px)',
        textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B3FA8', display: 'block', marginBottom: '14px' }}>Blog</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#1A1A1A', lineHeight: 1.05, marginBottom: '16px' }}>
            Perspectivas sobre{' '}
            <span style={{ color: '#8B3FA8' }}>medios universitarios</span>
          </h1>
          <p style={{ color: '#666', fontSize: 'clamp(14px,2vw,18px)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            Insights, datos y estrategias para marcas que quieren conectar con la generación universitaria colombiana.
          </p>
        </motion.div>
      </section>

      {/* Grid de artículos */}
      <section style={{ padding: 'clamp(40px,6vw,80px) 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
          {posts.map((p, i) => {
            const col = categoryColors[p.category] || '#00C4AD'
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
                style={{
                  padding: '28px', borderRadius: '18px', background: '#FAFAFA',
                  border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', gap: '14px', cursor: 'pointer',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '4px 10px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>{p.category}</span>
                  <span style={{ fontSize: '11px', color: '#AAA' }}>{p.readTime}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '8px' }}>{p.title}</h2>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>{p.excerpt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{p.date}</span>
                  <span style={{ fontSize: '12px', color: col, fontWeight: 700 }}>Leer artículo →</span>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      {/* Footer mínimo */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '24px 2rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#8B3FA8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>← Volver al sitio principal</a>
      </footer>
    </div>
  )
}
