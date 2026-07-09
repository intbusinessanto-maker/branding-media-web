import { useRef, useState } from 'react'

interface Comparison { vs: string; ourTitle: string; ourText: string; theirTitle: string; theirText: string; color: string }
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const TRAY_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/bandeja.png'

const comparisons = [
  {
    vs: 'Universidades vs Centros Comerciales',
    ourTitle: 'Segmentación perfecta',
    ourText: 'Perfil universitario 100% verificado: edad, nivel socioeconómico, ciudad, área de estudio. Cero desperdicio en audiencia irrelevante.',
    theirTitle: 'Audiencia dispersa',
    theirText: 'Audiencia mixta: familias, adultos mayores, turistas, niños. El target joven adulto universitario representa solo el 25–30% del tráfico de un CC promedio.',
    color: '#00C4AD',
  },
  {
    vs: 'Universidades vs Vallas Urbanas',
    ourTitle: 'Dominio del espacio',
    ourText: 'Entorno de baja densidad publicitaria. Tu marca domina el espacio universitario. Sin competencia directa visible a metros de distancia.',
    theirTitle: 'Saturación total',
    theirText: 'Alta saturación. En una vía urbana promedio hay entre 3 y 5 vallas visibles desde un mismo punto. El 86% de los transeúntes desarrolló ceguera a vallas.',
    color: '#E8118A',
  },
  {
    vs: 'Universidades vs Aeropuertos',
    ourTitle: 'Activación sin límites',
    ourText: 'Alta y flexible. El campus permite múltiples formatos de interacción sin restricciones de seguridad. Activaciones inmersivas, tecnológicas y culturales.',
    theirTitle: 'Activación restringida',
    theirText: 'Muy restrictiva. Los aeropuertos aplican protocolos de seguridad estrictos que limitan las activaciones. Todo requiere aprobación de Aerocivil.',
    color: '#8B3FA8',
  },
  {
    vs: 'Universidades vs Publicidad Aeroportuaria',
    ourTitle: 'Formación de hábitos',
    ourText: 'Máxima. El 78% de los hábitos de consumo que perduran toda la vida se forman entre los 18 y 25 años. El campus es el escenario exacto.',
    theirTitle: 'Hábitos ya consolidados',
    theirText: 'Baja. El viajero frecuente ya tiene hábitos consolidados. La publicidad aeroportuaria es de recordación y estatus, no de formación de preferencias.',
    color: '#00C4AD',
  },
  {
    vs: 'Universidades vs TV y Radio',
    ourTitle: 'Brand safety total',
    ourText: 'Total. El campus universitario es un entorno 100% controlado: sin contenido adverso, sin comentarios, sin contexto editorial negativo.',
    theirTitle: 'Riesgo de contexto',
    theirText: 'Riesgo permanente. En TV y radio el anuncio puede quedar entre noticias de escándalos. La asociación de marca es involuntaria.',
    color: '#E8118A',
  },
  {
    vs: 'Universidades vs ATL Tradicional',
    ourTitle: 'Fidelidad real',
    ourText: '85% de anunciantes renuevan con Branding Media. Los resultados generan retención natural, no descuentos de renovación forzada.',
    theirTitle: 'Alta rotación',
    theirText: 'Los anunciantes de ATL cambian frecuentemente de medio y de formato buscando mayor efectividad. La fidelidad al medio es baja.',
    color: '#8B3FA8',
  },
]

/* ─── Card (compartida desktop y mobile) ─── */
function ComparisonCard({ c, compact = false }: { c: Comparison; compact?: boolean }) {
  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      background: '#111116',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${c.color}20, ${c.color}08)`,
        borderBottom: `1px solid ${c.color}25`,
        padding: compact ? '12px 16px' : '12px 18px',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, flexShrink: 0, boxShadow: `0 0 7px ${c.color}80` }} />
        <span style={{ fontSize: compact ? '11px' : 'clamp(10px, 1vw, 12px)', fontWeight: 800, color: c.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {c.vs}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: compact ? '16px' : 'clamp(14px, 1.6vw, 22px)', background: `${c.color}09`, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: compact ? 14 : 13 }}>✅</span>
            <span style={{ fontSize: compact ? '10px' : 'clamp(9px, 0.85vw, 11px)', fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Branding Media</span>
          </div>
          <p style={{ fontSize: compact ? '14px' : 'clamp(13px, 1.15vw, 15px)', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.3 }}>{c.ourTitle}</p>
          <p style={{ fontSize: compact ? '13px' : 'clamp(12px, 1vw, 14px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{c.ourText}</p>
        </div>
        <div style={{ padding: compact ? '16px' : 'clamp(14px, 1.6vw, 22px)', background: 'rgba(255,255,255,0.018)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: compact ? 14 : 13 }}>❌</span>
            <span style={{ fontSize: compact ? '10px' : 'clamp(9px, 0.85vw, 11px)', fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Otros medios</span>
          </div>
          <p style={{ fontSize: compact ? '14px' : 'clamp(13px, 1.15vw, 15px)', fontWeight: 700, color: 'rgba(255,255,255,0.45)', margin: '0 0 8px', lineHeight: 1.3 }}>{c.theirTitle}</p>
          <p style={{ fontSize: compact ? '13px' : 'clamp(12px, 1vw, 14px)', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, margin: 0 }}>{c.theirText}</p>
        </div>
      </div>
    </div>
  )
}

const BG_GRAD = 'radial-gradient(ellipse at 18% 10%, rgba(0,196,173,0.07) 0%, transparent 48%), radial-gradient(ellipse at 82% 90%, rgba(232,17,138,0.05) 0%, transparent 48%)'

/* ─── Carrusel compartido (mobile y desktop) ─── */
function ComparisonCarousel({ compact = false }: { compact?: boolean }) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [activeCard, setActiveCard] = useState(0)

  const scrollTo = (idx: number) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollTo({ left: idx * carouselRef.current.clientWidth, behavior: 'smooth' })
    setActiveCard(idx)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 10 }}>
      {/* Carrusel — altura dinámica según contenido */}
      <div style={{ position: 'relative', width: '100%' }}>
        <style>{`.cmp-carousel::-webkit-scrollbar{display:none}`}</style>
        <div
          ref={carouselRef}
          className="cmp-carousel"
          onScroll={e => {
            const t = e.target as HTMLDivElement
            if (t.clientWidth) setActiveCard(Math.round(t.scrollLeft / t.clientWidth))
          }}
          style={{
            display: 'flex', overflowX: 'scroll',
            scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {comparisons.map((c) => (
            <div key={c.vs} style={{
              flexShrink: 0, width: '100%', scrollSnapAlign: 'start',
              padding: compact ? '0 1rem' : '0 clamp(1rem,2vw,2rem)',
              boxSizing: 'border-box',
            }}>
              <ComparisonCard c={c} compact={compact} />
            </div>
          ))}
        </div>

        {/* Flechas — centradas verticalmente sobre la card */}
        {activeCard > 0 && (
          <button onClick={() => scrollTo(activeCard - 1)} style={{
            all: 'unset', position: 'absolute',
            left: compact ? 2 : 6, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff', zIndex: 5, cursor: 'pointer',
          }}>‹</button>
        )}
        {activeCard < comparisons.length - 1 && (
          <button onClick={() => scrollTo(activeCard + 1)} style={{
            all: 'unset', position: 'absolute',
            right: compact ? 2 : 6, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff', zIndex: 5, cursor: 'pointer',
          }}>›</button>
        )}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {comparisons.map((c, i) => (
          <button key={c.vs} onClick={() => scrollTo(i)} style={{
            all: 'unset', height: 5, borderRadius: 3, transition: 'all 0.25s', cursor: 'pointer',
            width: activeCard === i ? 20 : 5,
            background: activeCard === i ? c.color : 'rgba(255,255,255,0.2)',
          }} />
        ))}
      </div>
    </div>
  )
}

export default function Comparison() {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  /*
   * useScroll solo para la animación del telón (bandeja que se abre/cierra).
   * El contenido ya NO está supeditado al scroll — aparece libremente
   * dentro del carrusel una vez que la bandeja está abierta.
   */
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })

  /* Telón — abre rápido (0→50% del scroll), queda abierto, cierra al final */
  const rawTop = useTransform(scrollYProgress, [0.05, 0.50, 0.80, 0.98], [0, -100, -100, 0])
  const rawBot = useTransform(scrollYProgress, [0.05, 0.50, 0.80, 0.98], [0,  100,  100, 0])
  const topSpr = useSpring(rawTop, { stiffness: 80, damping: 20, mass: 0.5 })
  const botSpr = useSpring(rawBot, { stiffness: 80, damping: 20, mass: 0.5 })
  const topY   = useTransform(topSpr, v => `${v}%`)
  const botY   = useTransform(botSpr, v => `${v}%`)

  /* Contenido: solo desliza hacia arriba, sin fade que opaque las cards */
  const contentY  = useTransform(scrollYProgress, [0.15, 0.45], [20, 0])

  /* outerH corto: el telón abre al primer scroll, el carrusel queda accesible */
  const outerH = '140vh'

  return (
    <div ref={outerRef} id="comparison-outer" style={{ height: outerH, position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: isMobile ? '100dvh' : '100vh',
        overflow: 'hidden',
      }}>

        {/* Fondo */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0D0D10', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: BG_GRAD }} />
        </div>

        {/* Contenido centrado vertical y horizontalmente como bloque compacto */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          y: contentY,
          padding: isMobile ? '0' : '0 clamp(1rem, 4vw, 2.5rem)',
        }}>
          <div style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '960px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: isMobile ? '10px' : '14px',
          }}>
            {/* Título */}
            <div style={{ textAlign: 'center', padding: '0 1rem' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                Comparativa de medios
              </span>
              <h2 style={{
                fontSize: isMobile ? 'clamp(1.1rem, 4.5vw, 1.4rem)' : 'clamp(1.15rem, 2.4vw, 1.9rem)',
                fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, color: '#fff', margin: 0,
              }}>
                ¿Por qué <span style={{ color: '#E8118A' }}>CONVERTIMOS</span> en los espacios de pauta más importantes?
              </h2>
            </div>

            {/* Card — altura fija para que no se estire */}
            <ComparisonCarousel compact={isMobile} />
          </div>
        </motion.div>

        {/* Telón superior */}
        <motion.div style={{ position: 'absolute', inset: 0, background: '#0D0D10', clipPath: 'inset(0 0 50% 0)', zIndex: 10, y: topY, pointerEvents: 'none' }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
        </motion.div>
        {/* Telón inferior */}
        <motion.div style={{ position: 'absolute', inset: 0, background: '#0D0D10', clipPath: 'inset(50% 0 0 0)', zIndex: 10, y: botY, pointerEvents: 'none' }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
        </motion.div>

      </div>
    </div>
  )
}
