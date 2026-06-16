import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/*
 * Imagen subida al storage de Supabase:
 *   "periodico y maquina de escribir.webp"
 *
 * Técnica de 3 capas:
 *   Capa 0 — fondo: misma imagen muy oscura (brightness 0.18), ancho completo, siempre visible
 *   Capa 1 — reveal: misma imagen a brillo normal, con clip-path inset(0 X% 0 0)
 *             X baja de 100% a 0% al hacer scroll → efecto "papel saliendo de la máquina"
 *   Capa 2 — texto: contenido de la sección, aparece cuando el reveal llega al 50%
 */
const IMAGE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/periodico%20y%20maquina%20de%20escribir.webp'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

/* ── MÓVIL: layout simple con imagen de fondo ── */
function MobileAudience() {
  return (
    <section id="audiencia" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Imagen como header visual */}
      <div style={{
        width: '100%', height: '280px', overflow: 'hidden', position: 'relative',
      }}>
        <img src={IMAGE_URL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(17,17,17,1) 100%)' }} />
      </div>
      <div style={{ background: '#111', padding: '0 1.5rem 72px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '10px' }}>
          La audiencia
        </span>
        <h2 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '14px' }}>
          ¿Por qué llegar al <span style={{ color: '#8B3FA8' }}>campus?</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderRadius: '10px', background: 'rgba(232,17,138,0.1)', border: '1px solid rgba(232,17,138,0.18)', marginBottom: '20px' }}>
          <span style={{ fontSize: '36px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>3–6h</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Tiempo en campus</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Promedio diario del estudiante</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pillars.map((p, i) => (
            <motion.div key={p.number}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${p.color}` }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}15`, padding: '3px 7px', borderRadius: '5px', flexShrink: 0, height: 'fit-content' }}>{p.number}</span>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{p.title}</h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{p.body}</p>
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

  /*
   * offset 'start start' → 'end end':
   *   0  = top de la section en el top del viewport (comienza a verse)
   *   1  = bottom de la section en el bottom del viewport (termina de salir)
   * Con height 220vh esto da ~120vh de scroll "activo" para las animaciones
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* ── CAPA 1: reveal de la imagen ── */
  // clip va de 100 → 0 (right edge del clip retrocede de derecha a izquierda)
  const rawClip   = useTransform(scrollYProgress, [0.05, 0.55], [100, 0])
  const clipValue = useSpring(rawClip, { stiffness: 55, damping: 18, mass: 0.8 })
  const clipPath  = useTransform(clipValue, v => `inset(0 ${Math.max(0, v).toFixed(2)}% 0 0)`)

  /* ── CAPA 0 (fondo oscuro): la misma imagen siempre presente, muy tenue ── */
  // El overlay oscuro se va levantando a medida que el reveal avanza
  const bgOverlay = useTransform(scrollYProgress, [0, 0.10, 0.50, 0.80, 1.0], [0.97, 0.90, 0.58, 0.62, 0.90])

  /* ── CAPA 2: texto ── */
  const textOpacity = useTransform(scrollYProgress, [0.42, 0.64], [0, 1])
  const textY       = useTransform(scrollYProgress, [0.42, 0.64], [32, 0])

  /* Label que aparece primero para orientar al usuario */
  const labelOpacity = useTransform(scrollYProgress, [0.02, 0.14, 0.78, 0.90], [0, 1, 1, 0])

  if (isMobile) return <MobileAudience />

  return (
    <section
      ref={ref}
      id="audiencia"
      style={{ height: '220vh', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#060606' }}>

        {/* ── CAPA 0: fondo base — imagen oscura permanente ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.16) grayscale(0.2)',
        }} />

        {/* ── CAPA 1a: overlay que se levanta con el scroll ── */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: '#060606',
          opacity: bgOverlay,
          zIndex: 1,
        }} />

        {/* ── CAPA 1b: imagen a brillo normal, revelada izquierda→derecha ── */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            clipPath,
            zIndex: 2,
          }}
        />

        {/* Gradiente central para que el texto sea legible SIN tapar las personas */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 55% 70% at 50% 58%, rgba(6,6,6,0.72) 0%, transparent 80%)',
          zIndex: 3, pointerEvents: 'none',
        }} />

        {/* ── LABEL: aparece primero, desaparece cuando el reveal termina ── */}
        <motion.div
          style={{
            position: 'absolute', top: '12%', left: 0, right: 0,
            textAlign: 'center', zIndex: 6,
            opacity: labelOpacity,
            pointerEvents: 'none',
          }}
        >
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
            display: 'block', marginBottom: '14px',
          }}>
            La audiencia
          </span>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            fontWeight: 900, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.06,
          }}>
            ¿Por qué llegar al{' '}
            <span style={{ color: '#8B3FA8' }}>campus?</span>
          </h2>
        </motion.div>

        {/* ── CAPA 2: contenido centrado, entre las dos personas ── */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '8%', left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(340px, 48%, 580px)',
            opacity: textOpacity,
            y: textY,
            zIndex: 7,
            pointerEvents: 'all',
          }}
        >
          {/* Stat 3–6h */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '14px 20px', borderRadius: '12px', marginBottom: '16px',
            background: 'rgba(232,17,138,0.12)',
            border: '1px solid rgba(232,17,138,0.22)',
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>
              3–6h
            </span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Tiempo en campus</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Promedio diario del estudiante</div>
            </div>
          </div>

          {/* Grid de pilares */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{
                  display: 'flex', gap: '10px', padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderLeft: `3px solid ${p.color}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}18`, padding: '2px 6px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '1px' }}>
                  {p.number}
                </span>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#fff', marginBottom: '3px', lineHeight: 1.2 }}>{p.title}</h4>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Indicador de scroll — solo cuando el reveal no ha comenzado */}
        <motion.div
          style={{
            position: 'absolute', bottom: '5%', left: '50%',
            transform: 'translateX(-50%)',
            opacity: useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0]),
            zIndex: 8, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          }}
        >
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)' }}
          />
        </motion.div>

      </div>
    </section>
  )
}
