import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

const miniStats = [
  { value: '15+',   label: 'Universidades', color: '#8B3FA8' },
  { value: '800K+', label: 'Estudiantes/mes', color: '#00C4AD' },
  { value: '5+',    label: 'Años', color: '#F07B00' },
]

export default function Hero() {
  return (
    <section id="inicio" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 'clamp(120px, 14vh, 160px) 1.5rem 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Formas geométricas sutiles — referencia posts */}
      <div style={{ position: 'absolute', top: '14%', right: '8%', width: '64px', height: '64px', background: '#fff', opacity: 0.65, transform: 'rotate(45deg)', borderRadius: '6px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '7%', width: '40px', height: '40px', background: '#00C4AD', opacity: 0.18, transform: 'rotate(45deg)', borderRadius: '4px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '35%', left: '5%', width: '80px', height: '80px', background: '#8B3FA8', opacity: 0.07, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '6%', width: '70px', height: '70px', background: '#F07B00', opacity: 0.08, borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: '820px' }}>

        {/* Badge minimalista */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: '32px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
            padding: '7px 20px', borderRadius: '100px',
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            <span style={{ color: '#8B3FA8' }}>● OOH</span>
            <span style={{ color: '#DDD' }}>|</span>
            <span style={{ color: '#00C4AD' }}>● DOOH</span>
            <span style={{ color: '#DDD' }}>|</span>
            <span style={{ color: '#F07B00' }}>● Universidades Colombia</span>
          </span>
        </motion.div>

        {/* Headline limpio */}
        <motion.h1 {...fadeUp(0.2)} style={{
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: '-0.03em', marginBottom: '20px',
          color: '#1A1A1A',
        }}>
          Tu marca frente a{' '}
          <span style={{ color: '#00C4AD' }}>+7 millones</span>
          <br />
          de personas.{' '}
          <span style={{ color: '#8B3FA8' }}>Listas para comprar.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p {...fadeUp(0.32)} style={{
          fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#666',
          lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 36px',
        }}>
          El circuito de medios universitarios más grande de Colombia.
          Conectamos marcas con las instituciones más influyentes del país.
        </motion.p>

        {/* Mini stats */}
        <motion.div {...fadeUp(0.42)} style={{
          display: 'flex', gap: '10px', justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: '36px',
        }}>
          {miniStats.map(s => (
            <div key={s.value} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '10px',
              background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.52)} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#contacto" style={{
            background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)',
            color: '#fff', padding: '14px 36px', borderRadius: '10px',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 6px 24px rgba(0,196,173,0.25)',
          }}>
            Activar campaña
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#mapa" style={{
            background: '#fff', color: '#1A1A1A',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '14px 36px', borderRadius: '10px',
            fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}>
            Ver cobertura
          </a>
        </motion.div>

        {/* Scroll */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#BBB', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, #8B3FA8, #00C4AD, transparent)' }} />
        </motion.div>
      </div>
    </section>
  )
}


