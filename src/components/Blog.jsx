import { motion } from 'framer-motion'

const categoryColors = {
  Estrategia: '#8B3FA8',
  DOOH: '#00C4AD',
  Tendencias: '#F07B00',
}

const posts = [
  {
    date: '03 Mar 2026',
    category: 'Estrategia',
    title: '¿Tu marca es protagonista o solo parte del paisaje?',
    excerpt: 'Estamos pagando fortunas por ser ignorados. El fin de la publicidad invisible en entornos universitarios.',
    readTime: '5 min',
  },
  {
    date: 'Próximamente',
    category: 'DOOH',
    title: 'Programmatic DOOH en universidades: la próxima frontera',
    excerpt: 'Cómo la compra programática de espacios digitales en campus está cambiando la planificación de medios.',
    readTime: '7 min',
  },
  {
    date: 'Próximamente',
    category: 'Tendencias',
    title: 'El universitario colombiano: el consumidor más valioso de la próxima década',
    excerpt: 'Datos, comportamientos y por qué las marcas más inteligentes ya están invirtiendo en este segmento.',
    readTime: '6 min',
  },
]

export default function Blog() {
  return (
    <section
      id="blog"
      style={{ padding: '100px 2rem', backgroundColor: '#080808', borderTop: '1px solid #1E1E1E' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}
        >
          <div>
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#8B3FA8',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'block', marginBottom: '16px',
            }}>
              Blog
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>
              Perspectivas sobre{' '}
              <span style={{
                background: 'linear-gradient(90deg, #8B3FA8, #00C4AD)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                medios universitarios
              </span>
            </h2>
          </div>
          <a
            href="#"
            style={{
              border: '1px solid #1E1E1E', color: '#888',
              padding: '10px 20px', borderRadius: '8px',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            }}
          >
            Ver todos →
          </a>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.map((p, i) => {
            const col = categoryColors[p.category] || '#00C4AD'
            const alphaHex = col === '#8B3FA8' ? 'rgba(139,63,168,' : col === '#00C4AD' ? 'rgba(0,196,173,' : 'rgba(240,123,0,'
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  border: `1px solid ${alphaHex}0.18)`,
                  backgroundColor: '#0D0D0D',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: col,
                    border: `1px solid ${alphaHex}0.25)`,
                    padding: '4px 10px', borderRadius: '100px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>
                    {p.category}
                  </span>
                  <span style={{ fontSize: '11px', color: '#444' }}>{p.readTime} lectura</span>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: '10px' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{p.excerpt}</p>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '16px', borderTop: `1px solid ${alphaHex}0.12)`,
                }}>
                  <span style={{ fontSize: '12px', color: '#444' }}>{p.date}</span>
                  <span style={{ fontSize: '12px', color: col, fontWeight: 600 }}>Leer →</span>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
