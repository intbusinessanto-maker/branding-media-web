import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const COLOMBIA_PATH = `
  M 70,191 L 63,187 L 55,183 L 50,185 L 36,183
  L 32,177 L 29,177 L 12,169 L 10,164 L 16,163
  L 15,156 L 19,151 L 27,150 L 34,141 L 41,133
  L 35,130 L 38,122 L 34,108 L 38,105 L 35,92
  L 28,85  L 30,78  L 36,79  L 39,75  L 35,66
  L 37,64  L 46,65  L 58,55  L 65,53  L 65,48
  L 68,36  L 77,30  L 88,29  L 89,26  L 102,27
  L 115,20 L 122,17 L 129,10 L 135,11 L 140,15
  L 136,20 L 126,22 L 122,29 L 115,33 L 110,39
  L 108,49 L 104,57 L 112,58 L 115,65 L 118,68
  L 119,74 L 118,79 L 118,82 L 122,83 L 126,88
  L 147,87 L 157,89 L 169,101 L 175,99 L 187,100
  L 197,99 L 202,101 L 199,109 L 196,114 L 194,124
  L 198,133 L 202,138 L 203,141 L 195,148 L 201,151
  L 205,156 L 210,170 L 207,172 L 204,164 L 199,159
  L 194,164 L 161,164 L 162,173 L 171,174 L 171,180
  L 168,178 L 158,181 L 158,191 L 165,196 L 168,205
  L 168,211 L 160,250 L 152,242 L 147,242 L 158,228
  L 145,221 L 135,222 L 129,220 L 120,223 L 108,222
  L 98,207 L 90,203 L 85,196 L 74,189 Z
`

/* labelDx/Dy: offset del punto al texto; labelAnchor: alineación SVG */
const CITIES = [
  {
    city: 'Barranquilla', x: 79,  y: 31,  count: 1,
    institutions: ['U. del Norte'],
    color: '#E8118A', labelAnchor: 'middle', labelDx: 0,   labelDy: -14,
  },
  {
    city: 'Cartagena',    x: 70,  y: 46,  count: 1,
    institutions: ['U. de los Andes'],
    color: '#00C4AD', labelAnchor: 'end',    labelDx: -13, labelDy: 1,
  },
  {
    city: 'Bucaramanga',  x: 107, y: 86,  count: 1,
    institutions: ['UPB Bucaramanga'],
    color: '#00C4AD', labelAnchor: 'start',  labelDx: 15,  labelDy: 1,
  },
  {
    city: 'Medellín',     x: 67,  y: 99,  count: 2,
    institutions: ['UPB Medellín', 'EAFIT'],
    color: '#E8118A', labelAnchor: 'start',  labelDx: 15,  labelDy: 1,
  },
  {
    city: 'Bogotá',       x: 91,  y: 121, count: 9,
    institutions: ['U. del Rosario','U. de los Andes','U. Externado','Javeriana','Sergio Arboleda','U. La Sabana','U. La Salle','U. Sanitas','U. América'],
    color: '#E8118A', labelAnchor: 'start',  labelDx: 15,  labelDy: 1,
  },
  {
    city: 'Cali',         x: 51,  y: 139, count: 1,
    institutions: ['ICESI'],
    color: '#00C4AD', labelAnchor: 'end',    labelDx: -13, labelDy: 1,
  },
]

const STEP_MS = 1200

/* Devuelve los bounds del rect blanco detrás del label */
function labelBg(name, lx, ly, anchor) {
  const w = name.length * 3.7 + 2  // ancho estimado del texto
  const pad = 3
  const total = w + pad * 2
  const rx = anchor === 'end'    ? lx - total + pad
           : anchor === 'middle' ? lx - total / 2
           :                       lx - pad
  return { x: rx, y: ly - 6, w: total, h: 10 }
}

/* ── CityCard simplificado (sin auto-reveal) ── */
function CityCard({ c, isActive, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={onToggle}
      whileHover={{ y: -2, boxShadow: `0 8px 28px ${c.color}22` }}
      style={{
        padding: '16px 18px', borderRadius: '12px', cursor: 'pointer',
        background: isActive ? `${c.color}08` : '#fff',
        border: `1.5px solid ${isActive ? c.color : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isActive ? `0 4px 20px ${c.color}18` : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isActive ? '12px' : 0 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: isActive ? c.color : '#1A1A1A', transition: 'color 0.2s' }}>
            {c.city}
          </div>
          <div style={{ fontSize: '11px', color: '#AAA', marginTop: '2px' }}>
            {c.count} {c.count === 1 ? 'institución' : 'instituciones'}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
            background: isActive ? c.color : 'rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 400,
            color: isActive ? '#fff' : '#999',
            transition: 'background 0.25s, color 0.25s',
          }}
        >
          +
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {c.institutions.map((inst, j) => (
                <motion.li
                  key={inst}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: j * 0.05 }}
                  style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.color, flexShrink: 0, display: 'inline-block' }} />
                  {inst}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── ColombiaMap ── */
export default function ColombiaMap() {
  const ref        = useRef(null)
  const started    = useRef(false)
  const releaseRef = useRef(null)   // para que el botón Skip pueda llamar a release()

  const inView = useInView(ref, { once: true, amount: 0.15 })

  const [seqIdx,  setSeqIdx]  = useState(-1)
  const [seqDone, setSeqDone] = useState(false)
  const [manual,  setManual]  = useState(new Set())

  const totalInstitutions = CITIES.reduce((s, c) => s + c.count, 0)

  const isActive = (cityName, idx) =>
    seqDone ? manual.has(cityName) : seqIdx === idx

  const toggleManual = (cityName) => {
    if (!seqDone) return
    setManual(prev => {
      const next = new Set(prev)
      if (next.has(cityName)) next.delete(cityName)
      else next.add(cityName)
      return next
    })
  }

  /* Botón Skip: desbloquea scroll, cancela la secuencia y termina */
  const handleSkip = () => {
    releaseRef.current?.()
    setSeqIdx(-1)
    setSeqDone(true)
  }

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const release = () => { releaseRef.current = null }
    releaseRef.current = release

    let cityTimers = []
    let tDone

    /* Pequeña pausa antes de animar las ciudades */
    const startTimer = setTimeout(() => {
      cityTimers = CITIES.map((_, i) =>
        setTimeout(() => setSeqIdx(i), i * STEP_MS)
      )
      tDone = setTimeout(() => {
        setSeqIdx(-1)
        setSeqDone(true)
        release()
      }, CITIES.length * STEP_MS)
    }, 650)

    return () => {
      clearTimeout(startTimer)
      cityTimers.forEach(clearTimeout)
      clearTimeout(tDone)
      release()
    }
  }, [inView])

  return (
    /* Sección full-screen — flex column para que header + grid llenen exactamente 100vh */
    <section ref={ref} id="mapa" className="colombia-section" style={{
      height: '100vh',
      minHeight: '600px',
      overflow: 'hidden',
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <style>{`
        .map-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          flex: 1;
          min-height: 0;
          align-items: stretch;
        }
        /* Tablet: lado a lado más compacto */
        @media (max-width: 900px) {
          .map-grid {
            grid-template-columns: 1.3fr 1fr;
            gap: 10px;
          }
          .map-svg-col {
            transform: none !important;
            padding: 12px !important;
          }
        }
        /* Móvil: stack vertical — mapa arriba, cards abajo */
        @media (max-width: 600px) {
          .colombia-section {
            height: auto !important;
            min-height: 100svh !important;
            overflow: visible !important;
          }
          .map-wrapper {
            padding: 16px 10px 20px !important;
          }
          .map-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            flex: none !important;
          }
          .map-svg-col {
            transform: none !important;
            padding: 8px !important;
            max-height: 78vw !important;
          }
          .map-cards-col {
            overflow-y: visible !important;
            max-height: none !important;
          }
        }
      `}</style>

      {/* Wrapper interno — distribuye el espacio con flexbox */}
      <div className="map-wrapper" style={{
        maxWidth: '1200px', width: '100%', margin: '0 auto',
        padding: '16px 20px 14px',
        display: 'flex', flexDirection: 'column',
        flex: 1, minHeight: 0,
      }}>

        {/* Header compacto */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ flexShrink: 0, marginBottom: '14px' }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>
            Cobertura Nacional
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.08, margin: 0 }}>
            Presencia en las principales{' '}
            <span style={{ color: '#8B3FA8' }}>ciudades universitarias</span>
          </h2>
        </motion.div>

        <div className="map-grid">

          {/* Mapa SVG — llena el alto disponible */}
          <motion.div
            className="map-svg-col"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              background: 'transparent',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 0,
            }}
          >
            <svg viewBox="5 5 215 252" style={{ width: '100%', maxWidth: '460px', height: '100%', maxHeight: '100%' }}>
              <defs>
                <clipPath id="colombiaClip">
                  <path d={COLOMBIA_PATH} />
                </clipPath>
              </defs>

              {/*
               * Regiones aproximadas de las 6 ciudades con universidad.
               * Cada zona cubre el área geográfica de esa ciudad y usa un tono único.
               * Paleta: progresión clarita (norte) → profundo (sur), sin colores chillones.
               *
               * Coordenadas SVG del mapa (viewBox 5 5 215 252):
               *   Barranquilla ≈ (79, 31)   — norte, clarito
               *   Cartagena    ≈ (70, 46)   — noroeste, claro
               *   Bucaramanga  ≈ (107, 86)  — nororiente, medio-claro
               *   Medellín     ≈ (67, 99)   — noroccidente, medio
               *   Bogotá       ≈ (91, 121)  — centro, medio-oscuro
               *   Cali         ≈ (51, 139)  — suroccidente, más oscuro
               *
               * Áreas aproximadas: cada ciudad "domina" su cuadrante.
               */}

              {/* Fondo base — sur/amazonía (más oscuro) */}
              <path d={COLOMBIA_PATH} fill="#C43275" />

              <g clipPath="url(#colombiaClip)">
                {/* ── Zona Barranquilla — norte costeño, clarito casi blanco ── */}
                <ellipse cx="85" cy="28" rx="80" ry="36" fill="#FFE8F5" />

                {/* ── Zona Cartagena — noroeste, rosa muy pálido ── */}
                <ellipse cx="58" cy="52" rx="55" ry="38" fill="#FFD8EE" />

                {/* ── Zona Bucaramanga — nororiente, rosa claro ── */}
                <ellipse cx="120" cy="85" rx="65" ry="42" fill="#FFB8DA" />

                {/* ── Zona Medellín — noroccidente, rosa medio ── */}
                <ellipse cx="62" cy="108" rx="58" ry="44" fill="#FF8EC0" />

                {/* ── Zona Bogotá — centro, magenta suave ── */}
                <ellipse cx="100" cy="128" rx="72" ry="46" fill="#E85499" />

                {/* ── Zona Cali — suroccidente, magenta medio-oscuro ── */}
                <ellipse cx="52" cy="150" rx="55" ry="48" fill="#D03880" />

                {/* ── Sur / Amazonía — el más oscuro (fondo) ya puesto ── */}
              </g>

              {/* Contorno del país — blanco suave */}
              <path d={COLOMBIA_PATH} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinejoin="round" />

              {CITIES.map((c, i) => {
                const active = isActive(c.city, i)
                const lx = c.x + c.labelDx
                const ly = c.y + c.labelDy
                const bg = labelBg(c.city, lx, ly, c.labelAnchor)

                return (
                  <g key={c.city} onClick={() => toggleManual(c.city)} style={{ cursor: 'pointer' }}>
                    {/* Pulso doble — negro, trazo delgado */}
                    <motion.circle cx={c.x} cy={c.y} r="8" fill="transparent" stroke="#1A1A1A" strokeWidth="0.4"
                      animate={{ r: [6, 22], opacity: [0.6, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.45, ease: 'easeOut' }} />
                    <motion.circle cx={c.x} cy={c.y} r="8" fill="transparent" stroke="#1A1A1A" strokeWidth="0.3"
                      animate={{ r: [6, 30], opacity: [0.35, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.45 + 0.5, ease: 'easeOut' }} />

                    {/* Dot principal negro */}
                    <motion.circle cx={c.x} cy={c.y}
                      r={c.count >= 9 ? 11 : c.count >= 2 ? 9 : 7.5}
                      fill={active ? '#E8118A' : '#1A1A1A'}
                      stroke="rgba(255,255,255,0.7)" strokeWidth="1.0"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} />

                    {/* Número — blanco */}
                    <motion.text x={c.x} y={c.y + 0.5} textAnchor="middle" dominantBaseline="middle"
                      fontSize={c.count >= 9 ? '8' : '7.5'} fontWeight="900"
                      fill="#fff" fontFamily="system-ui"
                      style={{ pointerEvents: 'none' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.15 }}>
                      {c.count}
                    </motion.text>

                    {/* Label ciudad — bloque blanco detrás del texto */}
                    <motion.g style={{ pointerEvents: 'none' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.15 }}>
                      <rect
                        x={bg.x} y={bg.y} width={bg.w} height={bg.h}
                        rx={2.5} fill="white"
                        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))' }}
                      />
                      <text
                        x={lx} y={ly + 0.5}
                        textAnchor={c.labelAnchor}
                        dominantBaseline="middle"
                        fontSize="6.5" fontWeight="700"
                        fill={active ? '#E8118A' : '#1A1A1A'}
                        fontFamily="system-ui"
                        style={{ transition: 'fill 0.2s' }}
                      >
                        {c.city}
                      </text>
                    </motion.g>
                  </g>
                )
              })}
            </svg>
          </motion.div>

          {/* Panel derecho — columna de ciudades con scroll interno */}
          <div className="map-cards-col" style={{
            display: 'flex', flexDirection: 'column', gap: '6px',
            overflowY: 'auto', minHeight: 0,
            paddingRight: '4px',   /* espacio para scrollbar */
          }}>
            {/* Total badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{
                padding: '12px 16px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(232,17,138,0.07) 0%, rgba(0,196,173,0.07) 100%)',
                border: '1px solid rgba(0,196,173,0.18)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: '#888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total red</div>
                <div style={{ fontSize: '10px', color: '#AAA', marginTop: '1px' }}>6 ciudades activas</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#E8118A', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {totalInstitutions}+
              </div>
            </motion.div>

            {/* Cards de ciudad */}
            {CITIES.map((c, i) => (
              <CityCard
                key={c.city}
                c={c}
                index={i}
                isActive={isActive(c.city, i)}
                onToggle={() => toggleManual(c.city)}
              />
            ))}

            <div style={{ padding: '8px 12px', fontSize: '10px', color: '#BBB', textAlign: 'center', flexShrink: 0 }}>
              {seqDone ? 'Toca una ciudad para ver sus universidades' : 'Explorando ciudades…'}
            </div>
          </div>

        </div>
      </div>

      {/* Botón Skip — visible solo mientras corre la secuencia automática */}
      <AnimatePresence>
        {!seqDone && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            onClick={handleSkip}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '24px',
              padding: '8px 18px',
              borderRadius: '100px',
              border: '1px solid rgba(0,0,0,0.12)',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#555',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              zIndex: 20,
            }}
          >
            Saltar →
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
