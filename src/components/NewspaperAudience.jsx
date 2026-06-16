import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/*
 * Técnica de capas:
 *   CAPA 0 — background: webp original con ligero oscurecimiento. Visible desde el inicio, sin overlay negro.
 *   CAPA 1 — personas (PNG sin fondo): siempre visible a baja opacidad
 *   CAPA 2 — personas REVEAL: mismo PNG al 100% de brillo, con clip-path inset(0 0 0 X%)
 *             X baja de ~48% → 0% al hacer scroll (de derecha a izquierda = papel sale del mecanógrafo hacia el periódico)
 *   CAPA 3 — texto centrado con backdrop-blur fuerte para máxima legibilidad
 */
const BG_URL  = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico%20y%20maquina%20de%20escribir.webp'
const PNG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico_y_maquina_de_escribir-removebg-preview.png'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

/* ── MÓVIL ── */
function MobileAudience() {
  return (
    <section id="audiencia" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '260px', overflow: 'hidden', position: 'relative' }}>
        <img src={BG_URL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
        <img src={PNG_URL} alt="" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: '100%', objectFit: 'contain' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #111 100%)' }} />
      </div>
      <div style={{ background: '#111', padding: '0 1.5rem 72px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>
          La audiencia
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>
          ¿Por qué llegar al{' '}<span style={{ color: '#8B3FA8' }}>campus?</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '10px', background: 'rgba(232,17,138,0.12)', border: '1px solid rgba(232,17,138,0.2)', marginBottom: '18px' }}>
          <span style={{ fontSize: '36px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>3–6h</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Tiempo en campus</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Promedio diario del estudiante</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pillars.map((p, i) => (
            <motion.div key={p.number}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${p.color}` }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}18`, padding: '3px 7px', borderRadius: '5px', flexShrink: 0, height: 'fit-content' }}>{p.number}</span>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{p.title}</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── DESKTOP ── */
export default function NewspaperAudience() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  /*
   * PAPEL: clip inset(0 0 0 X%) — X baja de 48 → 0
   * Revela de derecha a izquierda: el mecanógrafo (derecha) queda visible primero,
   * el papel crece hacia el lector de periódico (izquierda)
   */
  const rawClip   = useTransform(scrollYProgress, [0.06, 0.54], [48, 0])
  const clipValue = useSpring(rawClip, { stiffness: 52, damping: 17, mass: 0.9 })
  const clipPath  = useTransform(clipValue, v => `inset(0 0 0 ${Math.max(0, v).toFixed(2)}%)`)

  /* Texto: aparece cuando el papel ha llegado ~60% del camino */
  const textOp = useTransform(scrollYProgress, [0.44, 0.65], [0, 1])
  const textY  = useTransform(scrollYProgress, [0.44, 0.65], [28, 0])

  /* PNG ghost: siempre visible a baja opacidad para dar contexto de las personas */
  const ghostOp = useTransform(scrollYProgress, [0, 0.06, 0.85, 1.0], [0.18, 0.28, 0.28, 0.12])

  /* Fade out al final de la sección */
  const sectionOp = useTransform(scrollYProgress, [0.86, 1.0], [1, 0])

  if (isMobile) return <MobileAudience />

  return (
    <section ref={ref} id="audiencia" style={{ height: '220vh', position: 'relative' }}>
      <motion.div
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', opacity: sectionOp }}
      >

        {/* ── CAPA 0: fondo webp — visible desde el inicio, sin overlay negro ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.52)',
        }} />

        {/* ── CAPA 1: PNG ghost (siempre visible, baja opacidad) — da contexto inmediato ── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${PNG_URL})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            opacity: ghostOp,
          }}
        />

        {/* ── CAPA 2: PNG reveal — crece de derecha a izquierda (papel saliendo del mecanógrafo) ── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${PNG_URL})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            clipPath,
          }}
        />

        {/* Viñeta lateral suave para que el texto en el centro tenga contexto */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 75% at 50% 60%, rgba(0,0,0,0.55) 0%, transparent 80%)',
        }} />

        {/* ── CAPA 3: TEXTO — centrado, legible, backdrop-blur fuerte ── */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '7%', left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(360px, 44%, 600px)',
            opacity: textOp,
            y: textY,
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '18px',
            padding: '20px 24px 16px',
            background: 'rgba(0,0,0,0.62)',
            backdropFilter: 'blur(18px)',
            borderRadius: '16px 16px 0 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '8px' }}>
              La audiencia
            </span>
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-0.03em', lineHeight: 1.06,
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}>
              ¿Por qué llegar al{' '}
              <span style={{ color: '#8B3FA8' }}>campus?</span>
            </h2>
          </div>

          {/* Stat */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '14px 20px', marginBottom: '2px',
            background: 'rgba(232,17,138,0.18)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(232,17,138,0.3)',
            borderTop: 'none',
          }}>
            <span style={{ fontSize: 'clamp(28px, 4.5vw, 42px)', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0, textShadow: '0 0 30px rgba(232,17,138,0.5)' }}>
              3–6h
            </span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>Tiempo promedio en campus</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Más que en cualquier otro entorno</div>
            </div>
          </div>

          {/* Pilares */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{
                  display: 'flex', gap: '10px', padding: '13px 14px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(18px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: 'none',
                  borderLeft: `3px solid ${p.color}`,
                  borderRadius: i === 2 ? '0 0 0 16px' : i === 3 ? '0 0 16px 0' : '0',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}20`, padding: '2px 6px', borderRadius: '4px', flexShrink: 0, height: 'fit-content', marginTop: '1px' }}>
                  {p.number}
                </span>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginBottom: '3px', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{p.title}</h4>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.55 }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Indicador scroll inicial */}
        <motion.div
          style={{
            position: 'absolute', bottom: '5%', left: '50%',
            transform: 'translateX(-50%)',
            opacity: useTransform(scrollYProgress, [0, 0.06, 0.14], [1, 1, 0]),
            zIndex: 8, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.25)' }}
          />
        </motion.div>

      </motion.div>
    </section>
  )
}
