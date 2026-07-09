import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const MOBILE_IMG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/vista%20celuar.png'

const pillars = [
  { number: '01', title: 'Audiencia de alto valor',      body: 'El universitario colombiano es el consumidor del futuro: conectado, aspiracional y con alta influencia en decisiones de compra del hogar.',    color: '#00C4AD' },
  { number: '02', title: 'Contexto de concentración',    body: 'El campus es un entorno donde el estudiante permanece horas diarias, facilitando mayor exposición y recuerdo de marca.',                        color: '#8B3FA8' },
  { number: '03', title: 'Segmentación natural',         body: 'Cada universidad tiene un perfil socioeconómico específico. Tu campaña llega al segmento correcto en el campus correcto.',                      color: '#E8118A' },
  { number: '04', title: 'Baja saturación publicitaria', body: 'El entorno universitario tiene menos ruido publicitario que canales digitales o vía pública masiva, generando mayor impacto.',                  color: '#00C4AD' },
]

const VIMEO_ID   = '1204915287'
const VIMEO_HASH = 'e67a7306af'

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ── Capa de fondo compartida: video Vimeo + imagen fallback ── */
function VideoBg({ mobile }: { mobile?: boolean }) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
      {/* Imagen fallback — visible hasta que el video confirme carga, siempre presente como respaldo */}
      <img
        src={MOBILE_IMG_URL}
        alt=""
        loading="eager"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: mobile ? 'center top' : 'center center',
          transition: 'opacity 0.8s ease',
          opacity: videoLoaded ? 0 : 1,
        }}
      />
      {/* Video Vimeo — siempre montado, dispara onLoad cuando está listo */}
      <iframe
        src={`https://player.vimeo.com/video/${VIMEO_ID}?h=${VIMEO_HASH}&background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => setVideoLoaded(true)}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width:  'max(100vw, 177.78vh)',
          height: 'max(100vh, 56.25vw)',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          pointerEvents: 'none',
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
        title="Branding Media background"
      />
    </div>
  )
}

/* ── MOBILE ── */
function MobileAudience() {
  return (
    <section
      id="audiencia"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <VideoBg mobile />
      {/* Degradado */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.97) 100%)' }} />

      {/* Encabezado */}
      <div style={{ padding: 'clamp(60px,8vh,100px) 1.4rem 1rem', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: '6px' }}>
          La audiencia
        </span>
        <h2 style={{ fontSize: 'clamp(1.45rem, 5.5vw, 2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '10px' }}>
          ¿Por qué llegar a la{' '}<span style={{ color: '#8B3FA8' }}>universidad?</span>
        </h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '7px 13px', borderRadius: '10px', background: '#2A0A18', border: '1px solid rgba(232,17,138,0.35)' }}>
          <span style={{ fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>3–6h</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Tiempo en universidades</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Promedio diario del estudiante</div>
          </div>
        </div>
      </div>

      {/* Pilares — aparecen con whileInView, scroll libre */}
      <div style={{ flex: 1, padding: '0.5rem 1.4rem clamp(48px,6vh,80px)', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {pillars.map((p, i) => (
          <motion.div
            key={p.number}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div style={{
              display: 'flex', gap: '12px', padding: '12px 14px',
              borderRadius: '14px',
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: `4px solid ${p.color}`,
            }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '3px 7px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '2px' }}>
                {p.number}
              </span>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}>{p.title}</h4>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.5, margin: 0 }}>{p.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── DESKTOP ── */
export default function NewspaperAudience() {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileAudience />

  return (
    <section
      id="audiencia"
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <VideoBg />

      {/* Oscurecido sobre el video */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.42)' }} />

      {/* Contenido centrado */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: 'clamp(500px, 52%, 840px)',
        paddingTop: 'clamp(80px, 10vh, 120px)',
        paddingBottom: 'clamp(60px, 8vh, 100px)',
      }}>

        {/* Header + stat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            padding: '28px 36px 22px', textAlign: 'center',
            background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px 20px 0 0',
            border: '1px solid rgba(255,255,255,0.09)', borderBottom: 'none',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '10px' }}>
              La audiencia
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.4vw, 3.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.06, textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>
              ¿Por qué llegar a la{' '}<span style={{ color: '#8B3FA8' }}>universidad?</span>
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '18px 32px',
            background: '#2A0A18',
            border: '1px solid rgba(232,17,138,0.35)',
            borderTop: 'none', borderBottom: 'none',
          }}>
            <span style={{ fontSize: 'clamp(40px, 5.5vw, 62px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0 }}>
              3–6h
            </span>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>Tiempo promedio en universidades</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Más que en cualquier otro entorno</div>
            </div>
          </div>
        </motion.div>

        {/* Pilares 2×2 — aparecen escalonados con whileInView, scroll libre */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {pillars.map((p, i) => (
            <motion.div
              key={p.number}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              style={{
                display: 'flex', gap: '14px',
                padding: '22px 24px',
                background: 'rgba(0,0,0,0.74)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: `4px solid ${p.color}`,
                borderTop: i >= 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRadius:
                  i === 2 ? '0 0 0 20px' :
                  i === 3 ? '0 0 20px 0' : '0',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 900, color: p.color, background: `${p.color}22`, padding: '4px 8px', borderRadius: '5px', flexShrink: 0, height: 'fit-content', marginTop: '3px' }}>
                {p.number}
              </span>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '6px', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,1)' }}>{p.title}</h4>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
