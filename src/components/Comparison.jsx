import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

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

function ComparisonCard({ c }) {
  return (
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      background: '#111116',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${c.color}20, ${c.color}08)`,
        borderBottom: `1px solid ${c.color}25`,
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0, boxShadow: `0 0 7px ${c.color}80` }} />
        <span style={{ fontSize: 'clamp(8px, 0.9vw, 10px)', fontWeight: 800, color: c.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {c.vs}
        </span>
      </div>

      {/* Dos columnas */}
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

/*
 * Flujo acumulativo:
 *   1. Telón abre mientras la sección sube hacia el viewport (p 0.02→0.13)
 *   2. Fila 1 aparece (p 0.16→0.24) y SE QUEDA
 *   3. Fila 2 aparece (p 0.34→0.44) y SE QUEDA
 *   4. Fila 3 aparece (p 0.54→0.64) y SE QUEDA
 *   5. Las 3 filas visibles juntas hasta p≈0.85
 *   6. Telón cierra (p 0.85→0.96)
 *
 * 620vh de sección + offset ['start end','end start'] = 720vh de scroll total.
 * Las 3 filas usan flex:1 para repartirse el espacio disponible → siempre caben.
 */
export default function Comparison() {
  const outerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start end', 'end start'],
  })

  /* Telón */
  const rawTop = useTransform(scrollYProgress, [0.02, 0.13, 0.85, 0.96], [0, -100, -100, 0])
  const rawBot = useTransform(scrollYProgress, [0.02, 0.13, 0.85, 0.96], [0,  100,  100, 0])
  const topSpr = useSpring(rawTop, { stiffness: 44, damping: 13, mass: 0.9 })
  const botSpr = useSpring(rawBot, { stiffness: 44, damping: 13, mass: 0.9 })
  const topY = useTransform(topSpr, v => `${v}%`)
  const botY = useTransform(botSpr, v => `${v}%`)

  /* Filas — entran y SE QUEDAN (sin fade-out) */
  const row0op = useTransform(scrollYProgress, [0.16, 0.24], [0, 1])
  const row0y  = useTransform(scrollYProgress, [0.16, 0.26], [22, 0])
  const row1op = useTransform(scrollYProgress, [0.34, 0.44], [0, 1])
  const row1y  = useTransform(scrollYProgress, [0.34, 0.46], [22, 0])
  const row2op = useTransform(scrollYProgress, [0.54, 0.64], [0, 1])
  const row2y  = useTransform(scrollYProgress, [0.54, 0.66], [22, 0])

  const rows = [
    { cards: [comparisons[0], comparisons[1]], op: row0op, y: row0y },
    { cards: [comparisons[2], comparisons[3]], op: row1op, y: row1y },
    { cards: [comparisons[4], comparisons[5]], op: row2op, y: row2y },
  ]

  return (
    <div ref={outerRef} id="comparison-outer" style={{ height: '700vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Fondo */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#0D0D10', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 18% 10%, rgba(0,196,173,0.07) 0%, transparent 48%), radial-gradient(ellipse at 82% 90%, rgba(232,17,138,0.05) 0%, transparent 48%)' }} />
        </div>

        {/* Contenido principal */}
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

            {/* Título */}
            <div style={{ textAlign: 'center', marginBottom: 'clamp(10px, 1.6vh, 16px)', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', display: 'block', marginBottom: 7 }}>
                Comparativa de medios
              </span>
              <h2 style={{ fontSize: 'clamp(1.15rem, 2.4vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.18, color: '#fff', margin: 0 }}>
                ¿Por qué <span style={{ color: '#E8118A' }}>CONVERTIMOS</span> en los espacios de pauta más importantes?
              </h2>
            </div>

            {/* 3 filas en columna — cada fila toma 1/3 del espacio disponible */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 'clamp(8px, 1.2vh, 12px)', minHeight: 0 }}>
              {rows.map((row, ri) => (
                <motion.div
                  key={ri}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    opacity: row.op,
                    y: row.y,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(8px, 1.2vw, 14px)',
                  }}
                >
                  {row.cards.map(c => <ComparisonCard key={c.vs} c={c} />)}
                </motion.div>
              ))}
            </div>

          </div>
        </div>

        {/* Telón superior */}
        <motion.div style={{
          position: 'absolute', inset: 0, background: '#0D0D10',
          clipPath: 'inset(0 0 50% 0)', zIndex: 10, y: topY, pointerEvents: 'none',
        }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
        </motion.div>

        {/* Telón inferior */}
        <motion.div style={{
          position: 'absolute', inset: 0, background: '#0D0D10',
          clipPath: 'inset(50% 0 0 0)', zIndex: 10, y: botY, pointerEvents: 'none',
        }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', userSelect: 'none' }} />
        </motion.div>

      </div>
    </div>
  )
}
