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
    theirText: 'Muy restrictiva. Los aeropuertos aplican protocolos de seguridad estrictos que limitan drásticamente las activaciones. Todo requiere aprobación de Aerocivil.',
    color: '#8B3FA8',
  },
  {
    vs: 'Universidades vs Publicidad Aeroportuaria',
    ourTitle: 'Formación de hábitos',
    ourText: 'Máxima. El 78% de los hábitos de consumo que perduran toda la vida se forman entre los 18 y 25 años. El campus es el escenario exacto de esa ventana.',
    theirTitle: 'Hábitos ya consolidados',
    theirText: 'Baja. El viajero frecuente ya tiene hábitos consolidados. La publicidad aeroportuaria es de recordación y estatus, no de formación de preferencias nuevas.',
    color: '#00C4AD',
  },
  {
    vs: 'Universidades vs TV y Radio',
    ourTitle: 'Brand safety total',
    ourText: 'Total. El campus universitario es un entorno de comunicación 100% controlado: sin contenido adverso, sin comentarios, sin contexto editorial negativo.',
    theirTitle: 'Riesgo de contexto',
    theirText: 'Riesgo permanente. En TV y radio, el anuncio puede quedar entre noticias de escándalos o contenido negativo. La asociación de marca es involuntaria.',
    color: '#E8118A',
  },
  {
    vs: 'Universidades vs ATL Tradicional',
    ourTitle: 'Fidelidad real',
    ourText: '85% de anunciantes renuevan con Branding Media. Los resultados generan retención natural, no descuentos de renovación forzada.',
    theirTitle: 'Alta rotación',
    theirText: 'Los anunciantes de ATL cambian frecuentemente de medio, de agencia y de formato buscando mayor efectividad. La fidelidad al medio es baja.',
    color: '#8B3FA8',
  },
]

/*
 * Comparisons se muestran en 3 filas de 2 cards, reveladas una a una
 * mientras el telón (bandeja.png) está abierto.
 *
 * Timing del scroll (560vh total):
 *   0 → 0.10 : telón abre
 *   0.10→0.20: fila 1 aparece
 *   0.28→0.38: fila 2 aparece
 *   0.46→0.56: fila 3 aparece
 *   0.65→0.80: telón cierra
 */
export default function Comparison() {
  const outerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end start'],
  })

  /* Telón — igual que Blog */
  const rawTop = useTransform(scrollYProgress, [0, 0.10, 0.65, 0.80], [0, -100, -100, 0])
  const rawBot = useTransform(scrollYProgress, [0, 0.10, 0.65, 0.80], [0,  100,  100, 0])
  const topSpr = useSpring(rawTop, { stiffness: 44, damping: 13, mass: 0.9 })
  const botSpr = useSpring(rawBot, { stiffness: 44, damping: 13, mass: 0.9 })
  const topY = useTransform(topSpr, v => `${v}%`)
  const botY = useTransform(botSpr, v => `${v}%`)

  /* Filas — aparecen mientras el telón está abierto */
  const row0op = useTransform(scrollYProgress, [0.10, 0.20], [0, 1])
  const row0y  = useTransform(scrollYProgress, [0.10, 0.22], [30, 0])
  const row1op = useTransform(scrollYProgress, [0.28, 0.38], [0, 1])
  const row1y  = useTransform(scrollYProgress, [0.28, 0.40], [30, 0])
  const row2op = useTransform(scrollYProgress, [0.46, 0.56], [0, 1])
  const row2y  = useTransform(scrollYProgress, [0.46, 0.58], [30, 0])

  const rows = [
    { cards: [comparisons[0], comparisons[1]], op: row0op, y: row0y },
    { cards: [comparisons[2], comparisons[3]], op: row1op, y: row1y },
    { cards: [comparisons[4], comparisons[5]], op: row2op, y: row2y },
  ]

  return (
    <div ref={outerRef} id="comparison-outer" style={{ height: '560vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ─── CONTENIDO — comparativas, reveladas de a 1 fila ─── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: '#0D0D10',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 clamp(1rem, 4vw, 2.5rem)',
          zIndex: 1,
          overflow: 'hidden',
        }}>
          {/* Fondo decorativo */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 20% 0%, rgba(0,196,173,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(232,17,138,0.06) 0%, transparent 50%)' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            {/* Título */}
            <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 48px)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 12 }}>
                Comparativa de medios
              </span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', margin: 0 }}>
                ¿Por qué <span style={{ color: '#E8118A' }}>CONVERTIMOS</span> en los espacios de pauta más importantes?
              </h2>
            </div>

            {/* 3 filas de 2 cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.8vw, 20px)' }}>
              {rows.map((row, ri) => (
                <motion.div
                  key={ri}
                  style={{ opacity: row.op, y: row.y,
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px, 1.8vw, 20px)' }}
                >
                  {row.cards.map((c) => (
                    <div key={c.vs} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 6px 30px rgba(0,0,0,0.3)' }}>
                      {/* Header */}
                      <div style={{ background: `${c.color}18`, borderBottom: `1px solid ${c.color}30`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 'clamp(10px,1.5vw,12px)', fontWeight: 800, color: c.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {c.vs}
                        </span>
                      </div>
                      {/* Dos paneles */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <div style={{ padding: 'clamp(14px,2vw,22px)', background: `${c.color}0D`, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                            <span style={{ fontSize: 13 }}>✅</span>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Branding Media</span>
                          </div>
                          <p style={{ fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{c.ourTitle}</p>
                          <p style={{ fontSize: 'clamp(10px,1.1vw,12px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{c.ourText}</p>
                        </div>
                        <div style={{ padding: 'clamp(14px,2vw,22px)', background: 'rgba(255,255,255,0.03)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                            <span style={{ fontSize: 13 }}>❌</span>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Otros medios</span>
                          </div>
                          <p style={{ fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, lineHeight: 1.3 }}>{c.theirTitle}</p>
                          <p style={{ fontSize: 'clamp(10px,1.1vw,12px)', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: 0 }}>{c.theirText}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Telón superior — igual que Blog */}
        <motion.div style={{
          position: 'absolute', inset: 0, background: '#0D0D10',
          clipPath: 'inset(0 0 50% 0)', zIndex: 10, y: topY, pointerEvents: 'none',
        }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', display: 'block', userSelect: 'none' }} />
        </motion.div>

        {/* Telón inferior */}
        <motion.div style={{
          position: 'absolute', inset: 0, background: '#0D0D10',
          clipPath: 'inset(50% 0 0 0)', zIndex: 10, y: botY, pointerEvents: 'none',
        }}>
          <img src={TRAY_URL} alt="" draggable={false} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', display: 'block', userSelect: 'none' }} />
        </motion.div>

      </div>
    </div>
  )
}
