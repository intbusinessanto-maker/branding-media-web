import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const TRAY_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/bandeja.png'

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

export default function Blog() {
  const outerRef = useRef(null)

  /*
   * height: 220vh → sticky dura 120vh (220 - 100).
   * offset ['start start','end start']:
   *   progress 0 = outer.top en viewport.top
   *   progress 1 = outer.bottom en viewport.top (220vh después)
   *   unpin en 120/220 ≈ 0.545
   *
   * Telón: abre 0→0.13, visible 0.13→0.40, cierra 0.40→0.52 (< unpin 0.545)
   * → ~2-3 scrolls en total
   */
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end start'],
  })

  const rawTop = useTransform(scrollYProgress, [0, 0.13, 0.40, 0.52], [0, -100, -100, 0])
  const rawBot = useTransform(scrollYProgress, [0, 0.13, 0.40, 0.52], [0,  100,  100, 0])
  const topSpr = useSpring(rawTop, { stiffness: 44, damping: 13, mass: 0.9 })
  const botSpr = useSpring(rawBot, { stiffness: 44, damping: 13, mass: 0.9 })
  const topY = useTransform(topSpr, v => `${v}%`)
  const botY = useTransform(botSpr, v => `${v}%`)

  return (
    <div ref={outerRef} id="blog" style={{ height: '220vh', position: 'relative' }}>
      <style>{`
        /* Blog grid horizontal en móvil */
        @media (max-width: 640px) {
          .blog-grid {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 12px !important;
            padding-bottom: 4px;
          }
          .blog-grid::-webkit-scrollbar { display: none; }
          .blog-card {
            flex: 0 0 78vw !important;
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ─── CONTENIDO — siempre visible, nunca se anima ─── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 2rem',
          zIndex: 1,
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '8px' }}>Blog</span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1 }}>
                  Perspectivas sobre{' '}
                  <span style={{ color: '#8B3FA8' }}>medios universitarios</span>
                </h2>
              </div>
              <a href="#" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#555', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Ver todos →</a>
            </div>

            <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {posts.map((p, i) => {
                const col = categoryColors[p.category] || '#00C4AD'
                return (
                  <article className="blog-card" key={i} style={{
                    padding: '20px', borderRadius: '14px', background: '#FAFAFA',
                    border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '3px 9px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>{p.category}</span>
                      <span style={{ fontSize: '10px', color: '#AAA' }}>{p.readTime}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '5px' }}>{p.title}</h3>
                      <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{p.excerpt}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '11px', color: '#AAA' }}>{p.date}</span>
                      <span style={{ fontSize: '11px', color: col, fontWeight: 600 }}>Leer →</span>
                    </div>
                  </article>
                )
              })}
            </div>

          </div>
        </div>

        {/*
         * ─── TELÓN — bandeja.png como cortina sobre el contenido ───
         *
         * Cada motion.div ocupa el viewport COMPLETO (inset: 0).
         * La imagen es idéntica en ambos (width/height 100%, contain, center).
         * clip-path recorta solo la mitad correspondiente.
         * El clip viaja con translateY → la mitad clippeada sale limpia de pantalla.
         * background: #fff cubre la sección detrás cuando el telón está cerrado.
         */}

        {/* Mitad SUPERIOR del telón */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          clipPath: 'inset(0 0 50% 0)',
          zIndex: 10,
          y: topY,
          pointerEvents: 'none',
        }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{
            width: '100%', height: '100%',
            objectFit: 'contain', objectPosition: 'center center',
            display: 'block', userSelect: 'none',
          }} />
        </motion.div>

        {/* Mitad INFERIOR del telón */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          clipPath: 'inset(50% 0 0 0)',
          zIndex: 10,
          y: botY,
          pointerEvents: 'none',
        }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{
            width: '100%', height: '100%',
            objectFit: 'contain', objectPosition: 'center center',
            display: 'block', userSelect: 'none',
          }} />
        </motion.div>

      </div>
    </div>
  )
}
