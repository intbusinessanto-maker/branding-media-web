import { useRef, useState } from 'react'
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

/* ─── Card desktop ─── */
function ComparisonCard({ c }) {
  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      background: '#111116',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${c.color}20, ${c.color}08)`,
        borderBottom: `1px solid ${c.color}25`,
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0, boxShadow: `0 0 7px ${c.color}80` }} />
        <span style={{ fontSize: 'clamp(8px, 0.9vw, 10px)', fontWeight: 800, color: c.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {c.vs}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>
        <div style={{ padding: 'clamp(10px, 1.4vw, 16px)', background: `${c.color}09`, borderRight: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <span style={{ fontSize: 11 }}>✅</span>
            <span style={{ fontSize: '8px', fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Branding Media</span>
          </div>
          <p style={{ fontSize: 'clamp(10px, 1.05vw, 12px)', fontWeight: 800, color: '#fff', margin: '0 0 5px', lineHeight: 1.3 }}>{c.ourTitle}</p>
          <p style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{c.ourText}</p>
        </div>
        <div style={{ padding: 'clamp(10px, 1.4vw, 16px)', background: 'rgba(255,255,255,0.018)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <span style={{ fontSize: 11 }}>❌</span>
            <span style={{ fontSize: '8px', fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Otros medios</span>
          </div>
          <p style={{ fontSize: 'clamp(10px, 1.05vw, 12px)', fontWeight: 700, color: 'rgba(255,255,255,0.4)', margin: '0 0 5px', lineHeight: 1.3 }}>{c.theirTitle}</p>
          <p style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', color: 'rgba(255,255,255,0.27)', lineHeight: 1.55, margin: 0 }}>{c.theirText}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Card mobile — paneles apilados verticalmente, texto legible ─── */
function MobileCard({ c }) {
  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      background: '#111116',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${c.color}22, ${c.color}09)`,
        borderBottom: `1px solid ${c.color}28`,
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0, boxShadow: `0 0 7px ${c.color}90` }} />
        <span style={{ fontSize: '10px', fontWeight: 800, color: c.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {c.vs}
        </span>
      </div>
      {/* Branding Media */}
      <div style={{ padding: '12px 14px', background: `${c.color}0B`, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>✅</span>
          <span style={{ fontSize: '9px', fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Branding Media</span>
        </div>
        <p style={{ fontSize: '12px', fontWeight: 800, color: '#fff', margin: '0 0 5px', lineHeight: 1.35 }}>{c.ourTitle}</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.6, margin: 0 }}>{c.ourText}</p>
      </div>
      {/* Otros medios */}
      <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>❌</span>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Otros medios</span>
        </div>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.42)', margin: '0 0 5px', lineHeight: 1.35 }}>{c.theirTitle}</p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6, margin: 0 }}>{c.theirText}</p>
      </div>
    </div>
  )
}

const BG_GRAD = 'radial-gradient(ellipse at 18% 10%, rgba(0,196,173,0.07) 0%, transparent 48%), radial-gradient(ellipse at 82% 90%, rgba(232,17,138,0.05) 0%, transparent 48%)'

export default function Comparison() {
  const outerRef = useRef(null)
  const carouselRef = useRef(null)
  const [activeCard, setActiveCard] = useState(0)
  const isMobile = useIsMobile()

  /*
   * Scroll sincronizado: offset ['start start','end end'] = progreso dentro
   * de la sección sticky (0 cuando entra, 1 cuando sale).
   * 0.00–0.12 → bandeja cerrada (telón en posición inicial)
   * 0.12–0.28 → bandeja se abre
   * 0.28–0.42 → fila 1 aparece
   * 0.42–0.56 → fila 2 aparece
   * 0.56–0.70 → fila 3 aparece
   * 0.82–0.96 → bandeja se cierra al salir
   */
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })

  /* Telón — mitad superior sube, mitad inferior baja */
  const rawTop = useTransform(scrollYProgress, [0.04, 0.26, 0.80, 0.96], [0, -100, -100, 0])
  const rawBot = useTransform(scrollYProgress, [0.04, 0.26, 0.80, 0.96], [0,  100,  100, 0])
  const topSpr = useSpring(rawTop, { stiffness: 60, damping: 18, mass: 0.7 })
  const botSpr = useSpring(rawBot, { stiffness: 60, damping: 18, mass: 0.7 })
  const topY   = useTransform(topSpr, v => `${v}%`)
  const botY   = useTransform(botSpr, v => `${v}%`)

  /* Contenido — aparece escalonado DENTRO de la bandeja abierta */
  const titleOp = useTransform(scrollYProgress, [0.26, 0.34], [0, 1])
  const titleY  = useTransform(scrollYProgress, [0.26, 0.34], [16, 0])
  const row0op  = useTransform(scrollYProgress, [0.34, 0.44], [0, 1])
  const row0y   = useTransform(scrollYProgress, [0.34, 0.44], [20, 0])
  const row1op  = useTransform(scrollYProgress, [0.48, 0.58], [0, 1])
  const row1y   = useTransform(scrollYProgress, [0.48, 0.58], [20, 0])
  const row2op  = useTransform(scrollYProgress, [0.60, 0.70], [0, 1])
  const row2y   = useTransform(scrollYProgress, [0.60, 0.70], [20, 0])
  const rows = [
    { cards: [comparisons[0], comparisons[1]], op: row0op, y: row0y },
    { cards: [comparisons[2], comparisons[3]], op: row1op, y: row1y },
    { cards: [comparisons[4], comparisons[5]], op: row2op, y: row2y },
  ]

  /* ── MOBILE: mismo patrón sticky que desktop — bandeja sincronizada con scroll ── */
  if (isMobile) {
    const scrollTo = (idx) => {
      if (!carouselRef.current) return
      carouselRef.current.scrollTo({ left: idx * carouselRef.current.clientWidth, behavior: 'smooth' })
      setActiveCard(idx)
    }

    return (
      <div ref={outerRef} id="comparison-outer" style={{ height: '250vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}>

          {/* Fondo */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0D0D10', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, background: BG_GRAD }} />
          </div>

          {/* Contenido: título + carrusel */}
          <motion.div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            display: 'flex', flexDirection: 'column',
            paddingTop: 'calc(65px + 1rem)',
            paddingBottom: '1.5rem',
            opacity: titleOp,
          }}>
            {/* Título */}
            <motion.div style={{ y: titleY, textAlign: 'center', marginBottom: '1rem', padding: '0 1rem', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'block', marginBottom: 8 }}>
                Comparativa de medios
              </span>
              <h2 style={{ fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, color: '#fff', margin: 0 }}>
                ¿Por qué <span style={{ color: '#E8118A' }}>CONVERTIMOS</span> en los espacios de pauta más importantes?
              </h2>
            </motion.div>

            {/* Carrusel */}
            <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
              <style>{`.cmp-carousel::-webkit-scrollbar{display:none}`}</style>
              <div
                ref={carouselRef}
                className="cmp-carousel"
                onScroll={e => {
                  const w = e.target.clientWidth
                  if (w) setActiveCard(Math.round(e.target.scrollLeft / w))
                }}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', overflowX: 'scroll',
                  scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {comparisons.map((c) => (
                  <div key={c.vs} style={{
                    flexShrink: 0, width: '100vw', scrollSnapAlign: 'start',
                    padding: '0 1rem', boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <MobileCard c={c} />
                  </div>
                ))}
              </div>

              {/* Flechas */}
              {activeCard > 0 && (
                <button onClick={() => scrollTo(activeCard - 1)} style={{
                  all: 'unset', position: 'absolute',
                  left: 6, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: '#fff', zIndex: 5,
                }}>‹</button>
              )}
              {activeCard < comparisons.length - 1 && (
                <button onClick={() => scrollTo(activeCard + 1)} style={{
                  all: 'unset', position: 'absolute',
                  right: 6, top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: '#fff', zIndex: 5,
                }}>›</button>
              )}
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 12, flexShrink: 0 }}>
              {comparisons.map((c, i) => (
                <button key={c.vs} onClick={() => scrollTo(i)} style={{
                  all: 'unset', height: 5, borderRadius: 3, transition: 'all 0.25s',
                  width: activeCard === i ? 20 : 5,
                  background: activeCard === i ? c.color : 'rgba(255,255,255,0.2)',
                }} />
              ))}
            </div>
          </motion.div>

          {/* Telón — misma lógica scroll que desktop */}
          <motion.div style={{ position: 'absolute', inset: 0, background: '#0D0D10', clipPath: 'inset(0 0 50% 0)', zIndex: 10, y: topY, pointerEvents: 'none' }}>
            <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
          </motion.div>
          <motion.div style={{ position: 'absolute', inset: 0, background: '#0D0D10', clipPath: 'inset(50% 0 0 0)', zIndex: 10, y: botY, pointerEvents: 'none' }}>
            <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
          </motion.div>

        </div>
      </div>
    )
  }

  /* ── DESKTOP: animación acumulativa con telón ── */
  return (
    <div ref={outerRef} id="comparison-outer" style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0D0D10', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: BG_GRAD }} />
        </div>

        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 'calc(65px + 1.1rem)',
          paddingLeft: 'clamp(1rem, 4vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 4vw, 2.5rem)',
          paddingBottom: '1.1rem',
          overflow: 'hidden',
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

            <motion.div style={{ opacity: titleOp, y: titleY, textAlign: 'center', marginBottom: 'clamp(10px, 1.6vh, 16px)', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'block', marginBottom: 7 }}>
                Comparativa de medios
              </span>
              <h2 style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.18, color: '#fff', margin: 0 }}>
                ¿Por qué <span style={{ color: '#E8118A' }}>CONVERTIMOS</span> en los espacios de pauta más importantes?
              </h2>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 'clamp(8px, 1.2vh, 12px)', minHeight: 0 }}>
              {rows.map((row, ri) => (
                <motion.div key={ri} style={{
                  flex: 1, minHeight: 0, opacity: row.op, y: row.y,
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(8px, 1.2vw, 14px)',
                }}>
                  {row.cards.map(c => <ComparisonCard key={c.vs} c={c} />)}
                </motion.div>
              ))}
            </div>

          </div>
        </div>

        <motion.div style={{ position: 'absolute', inset: 0, background: '#0D0D10', clipPath: 'inset(0 0 50% 0)', zIndex: 10, y: topY, pointerEvents: 'none' }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
        </motion.div>
        <motion.div style={{ position: 'absolute', inset: 0, background: '#0D0D10', clipPath: 'inset(50% 0 0 0)', zIndex: 10, y: botY, pointerEvents: 'none' }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
        </motion.div>

      </div>
    </div>
  )
}
