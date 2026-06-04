import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  return (
    <section
      id="inicio"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 2rem 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid sutil */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,196,173,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139,63,168,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Glow triple — un color por cada zona */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(139,63,168,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '350px',
        background: 'radial-gradient(ellipse, rgba(0,196,173,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '15%', right: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(240,123,0,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: '900px' }}>
        {/* Tag con los 3 colores */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            border: '1px solid #1E1E1E',
            padding: '8px 20px',
            borderRadius: '100px',
            fontSize: '12px', fontWeight: 600,
            color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B3FA8', boxShadow: '0 0 8px #8B3FA8', display: 'inline-block' }} />
            OOH
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C4AD', boxShadow: '0 0 8px #00C4AD', display: 'inline-block' }} />
            DOOH
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F07B00', boxShadow: '0 0 8px #F07B00', display: 'inline-block' }} />
            Universidades Colombia
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.2)} style={{
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          marginBottom: '24px',
        }}>
          Tu marca en el{' '}
          <span style={{
            background: 'linear-gradient(90deg, #8B3FA8, #00C4AD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>campus</span>
          <br />
          donde están los que{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
              position: 'absolute', bottom: '4px', left: 0, right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #8B3FA8, #00C4AD, #F07B00)',
              borderRadius: '2px',
            }} />
            deciden mañana
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p {...fadeUp(0.35)} style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: '#888',
          lineHeight: 1.7,
          maxWidth: '600px',
          margin: '0 auto 40px',
        }}>
          El circuito de medios universitarios más grande de Colombia.
          Conectamos marcas con +800.000 estudiantes en las instituciones
          más influyentes del país.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.5)} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#contacto"
            style={{
              background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)',
              color: '#fff',
              padding: '15px 36px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 0 30px rgba(0,196,173,0.25)',
            }}
          >
            Activar campaña
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="#mapa"
            style={{
              border: '1px solid #2A2A2A',
              color: '#fff',
              padding: '15px 36px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: 'transparent',
            }}
          >
            Ver cobertura
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontSize: '11px', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #8B3FA8, #00C4AD, transparent)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
