import { motion } from 'framer-motion'

const categoryColors = { Estrategia: '#8B3FA8', DOOH: '#00C4AD', Tendencias: '#E8118A' }

const posts = [
  { date: '03 Mar 2026', category: 'Estrategia', title: '¿Tu marca es protagonista o solo parte del paisaje?', excerpt: 'Estamos pagando fortunas por ser ignorados. El fin de la publicidad invisible en entornos universitarios.', readTime: '5 min' },
  { date: 'Próximamente', category: 'DOOH', title: 'Programmatic DOOH en universidades: la próxima frontera', excerpt: 'Cómo la compra programática de espacios digitales en campus está cambiando la planificación de medios.', readTime: '7 min' },
  { date: 'Próximamente', category: 'Tendencias', title: 'El universitario colombiano: el consumidor más valioso de la próxima década', excerpt: 'Datos, comportamientos y por qué las marcas más inteligentes ya están invirtiendo en este segmento.', readTime: '6 min' },
]

export default function Blog() {
  return (
    <section id="blog" style={{ padding: '100px 2rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Blog</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1 }}>
              Perspectivas sobre{' '}
              <span style={{ color: '#8B3FA8' }}>medios universitarios</span>
            </h2>
          </div>
          <a href="#" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#555', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Ver todos →</a>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {posts.map((p, i) => {
            const col = categoryColors[p.category] || '#00C4AD'
            return (
              <motion.article key={i}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.09)', transition: { duration: 0.2 } }}
              style={{
                  padding: '28px', borderRadius: '14px', background: '#FAFAFA',
                  border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', gap: '14px', cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>{p.category}</span>
                  <span style={{ fontSize: '11px', color: '#AAA' }}>{p.readTime} lectura</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '8px' }}>{p.title}</h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>{p.excerpt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{p.date}</span>
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



