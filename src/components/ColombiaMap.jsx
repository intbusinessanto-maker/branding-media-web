import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/*
 * Mapa de Colombia con imagen de relieve real (Wikimedia Commons, CC-BY-SA).
 * Los pines se superponen como SVG sobre la imagen usando coordenadas
 * calculadas a partir de la latitud/longitud real de cada ciudad.
 *
 * Imagen: 2028×2294 px, relieve físico de Colombia y sus vecinos.
 * Extensión geográfica aprox: -82°W a -64°W, -7°S a +14°N
 * → Fórmula: xPct = (lon_abs - 64) / 18 * 88.4,  yPct = (14 - lat) / 21 * 100
 */

const TERRAIN_URL = 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Colombia_relief_location_map.jpg'

/* Posiciones en % del mapa calculadas desde lat/lon reales */
const CITIES = [
  {
    city: 'Barranquilla', xPct: 40.0, yPct: 14.5, count: 1,
    institutions: ['U. del Norte'],
    color: '#E8118A', labelSide: 'right',
  },
  {
    city: 'Cartagena', xPct: 36.1, yPct: 17.2, count: 1,
    institutions: ['U. de los Andes – Sede Caribe'],
    color: '#E8118A', labelSide: 'left',
  },
  {
    city: 'Bucaramanga', xPct: 49.3, yPct: 32.7, count: 1,
    institutions: ['UPB Bucaramanga'],
    color: '#E8118A', labelSide: 'right',
  },
  {
    city: 'Medellín', xPct: 35.8, yPct: 36.9, count: 2,
    institutions: ['UPB Medellín', 'EAFIT'],
    color: '#E8118A', labelSide: 'left',
  },
  {
    city: 'Bogotá', xPct: 44.1, yPct: 44.2, count: 9,
    institutions: ['U. del Rosario','U. de los Andes','U. Externado','Javeriana','Sergio Arboleda','U. La Sabana','U. La Salle','U. Sanitas','U. América'],
    color: '#E8118A', labelSide: 'right',
  },
  {
    city: 'Cali', xPct: 30.4, yPct: 50.3, count: 2,
    institutions: ['ICESI', 'Javeriana Cali'],
    color: '#E8118A', labelSide: 'left',
  },
]

const STEP_MS = 1200
/* Aspecto real de la imagen: 2028 / 2294 ≈ 0.884 */
const IMG_ASPECT = 2028 / 2294

function CityCard({ c, isActive, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={onToggle}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(232,17,138,0.18)' }}
      style={{
        padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
        background: isActive ? 'rgba(232,17,138,0.08)' : '#fff',
        border: `1.5px solid ${isActive ? '#E8118A' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isActive ? '0 4px 20px rgba(232,17,138,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isActive ? '12px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
            <path d="M6 0C2.69 0 0 2.69 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6z" fill="#E8118A"/>
            <circle cx="6" cy="6" r="2" fill="white"/>
          </svg>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: isActive ? '#E8118A' : '#1A1A1A', transition: 'color 0.2s' }}>
              {c.city}
            </div>
            <div style={{ fontSize: '11px', color: '#AAA', marginTop: '1px' }}>
              {c.count} {c.count === 1 ? 'institución' : 'instituciones'}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: isActive ? '#E8118A' : 'rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', color: isActive ? '#fff' : '#999',
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
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E8118A', flexShrink: 0, display: 'inline-block' }} />
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

export default function ColombiaMap() {
  const ref     = useRef(null)
  const started = useRef(false)
  const relRef  = useRef(null)
  const inView  = useInView(ref, { once: true, amount: 0.15 })

  const [seqIdx,  setSeqIdx]  = useState(-1)
  const [seqDone, setSeqDone] = useState(false)
  const [manual,  setManual]  = useState(new Set())

  const totalInstitutions = CITIES.reduce((s, c) => s + c.count, 0)

  const isActive = (city, idx) => seqDone ? manual.has(city) : seqIdx === idx

  const toggleManual = (city) => {
    if (!seqDone) return
    setManual(prev => {
      const next = new Set(prev)
      next.has(city) ? next.delete(city) : next.add(city)
      return next
    })
  }

  const handleSkip = () => { relRef.current?.(); setSeqIdx(-1); setSeqDone(true) }

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const release = () => { relRef.current = null }
    relRef.current = release
    let timers = [], tDone
    const t0 = setTimeout(() => {
      timers = CITIES.map((_, i) => setTimeout(() => setSeqIdx(i), i * STEP_MS))
      tDone  = setTimeout(() => { setSeqIdx(-1); setSeqDone(true); release() }, CITIES.length * STEP_MS)
    }, 650)
    return () => { clearTimeout(t0); timers.forEach(clearTimeout); clearTimeout(tDone); release() }
  }, [inView])

  return (
    <section ref={ref} id="mapa" className="colombia-section" style={{
      height: '100vh', minHeight: '600px', overflow: 'hidden',
      background: 'transparent',
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <style>{`
        .map-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          flex: 1; min-height: 0; align-items: center;
        }
        @media (max-width: 900px) { .map-grid { grid-template-columns: 1.3fr 1fr; gap: 10px; } }
        @media (max-width: 600px) {
          .colombia-section { height: auto !important; min-height: 100svh !important; overflow: visible !important; }
          .map-wrapper { padding: 16px 10px 20px !important; }
          .map-grid { grid-template-columns: 1fr !important; gap: 10px !important; flex: none !important; }
          .map-cards-col { overflow-y: visible !important; max-height: none !important; }
          .map-3d-svg { transform: none !important; }
          .map-3d-wrap { perspective: none !important; }
        }
      `}</style>

      <div className="map-wrapper" style={{
        maxWidth: '1200px', width: '100%', margin: '0 auto',
        padding: '16px 20px 14px',
        display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
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

          {/* ── Mapa HD de terreno real con pines superpuestos ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="map-3d-wrap"
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              minHeight: 0, padding: '8px',
              perspective: '1100px',
              perspectiveOrigin: '52% -8%',
            }}
          >
            {/*
             * Contenedor 3D — imagen + SVG de pines comparten el mismo transform.
             * position:relative permite que el SVG se superponga exactamente.
             */}
            <div
              className="map-3d-svg"
              style={{
                width: '100%', maxWidth: '460px',
                transform: 'rotateX(28deg) rotateZ(-9deg)',
                transformOrigin: 'center 52%',
                filter: 'drop-shadow(12px 28px 18px rgba(0,0,0,0.22))',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Imagen de relieve real — Colombia terrain map (Wikimedia CC-BY-SA) */}
              <img
                src={TERRAIN_URL}
                alt="Mapa relieve Colombia"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  /* Escala de grises suave para que los pines magenta resalten */
                  filter: 'grayscale(0.85) brightness(1.08) contrast(1.06)',
                }}
                crossOrigin="anonymous"
              />

              {/*
               * SVG overlay — mismas dimensiones que la imagen (100% × 100%).
               * viewBox="0 0 100 113.1" reproduce el aspecto real de la imagen
               * (2028 / 2294 ≈ 0.884 → inverso = 1.131).
               * Las coordenadas de los pines son % del área de la imagen
               * calculadas desde la latitud/longitud de cada ciudad.
               */}
              <svg
                viewBox="0 0 100 113.1"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <filter id="lbl-shadow" x="-20%" y="-30%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.22)"/>
                  </filter>
                </defs>

                {CITIES.map((c, i) => {
                  const active = isActive(c.city, i)
                  /* x/y en el espacio viewBox (0-100 horizontal, 0-113.1 vertical) */
                  const px = c.xPct
                  const py = c.yPct * 1.131   /* escala y al aspecto real */
                  const PR = active ? 3.5 : 2.6
                  const PT = active ? 8.0 : 5.8

                  /* Etiqueta de ciudad */
                  const LW = c.city.length * 1.6 + 3
                  const LH = 4.5
                  const lx = c.labelSide === 'right' ? px + PR + 2.5 : px - PR - LW - 1.5
                  const ly = py - PT - LH / 2

                  return (
                    <g key={c.city} onClick={() => toggleManual(c.city)} style={{ cursor: 'pointer' }}>
                      {/* Pulso cuando activo */}
                      {active && (
                        <>
                          <circle cx={px} cy={py - PT} r={PR} fill="none" stroke="#E8118A" strokeWidth="0.4" opacity="0">
                            <animate attributeName="r" from={PR} to={PR * 5} dur="2.2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.7" to="0" dur="2.2s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx={px} cy={py - PT} r={PR} fill="none" stroke="#E8118A" strokeWidth="0.25" opacity="0">
                            <animate attributeName="r" from={PR} to={PR * 8} dur="2.2s" repeatCount="indefinite" begin="0.7s"/>
                            <animate attributeName="opacity" from="0.4" to="0" dur="2.2s" repeatCount="indefinite" begin="0.7s"/>
                          </circle>
                        </>
                      )}

                      {/* Pin teardrop magenta */}
                      <path
                        d={`M ${px} ${py}
                           C ${px - 1.2} ${py - 1.8}
                             ${px - PR - 1.2} ${py - PT * 0.3}
                             ${px - PR - 1.2} ${py - PT}
                           C ${px - PR - 1.2} ${py - PT - PR * 2.2}
                             ${px + PR + 1.2} ${py - PT - PR * 2.2}
                             ${px + PR + 1.2} ${py - PT}
                           C ${px + PR + 1.2} ${py - PT * 0.3}
                             ${px + 1.2} ${py - 1.8}
                             ${px} ${py} Z`}
                        fill="#E8118A"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="0.3"
                      />
                      <circle cx={px} cy={py - PT} r={PR * 0.38} fill="white" />
                      {c.count > 1 && (
                        <text x={px} y={py - PT + PR * 0.15}
                          textAnchor="middle" dominantBaseline="middle"
                          fontSize={active ? '2.5' : '2'} fontWeight="900" fill="white" fontFamily="system-ui"
                          style={{ pointerEvents: 'none' }}>
                          {c.count}
                        </text>
                      )}

                      {/* Etiqueta de ciudad — fondo blanco + texto magenta */}
                      <g style={{ pointerEvents: 'none' }}>
                        <rect x={lx} y={ly} width={LW} height={LH} rx="1.2"
                          fill="white" opacity="0.92" filter="url(#lbl-shadow)" />
                        <text
                          x={lx + LW / 2} y={ly + LH / 2}
                          textAnchor="middle" dominantBaseline="middle"
                          fontSize="2.8" fontWeight="800" fill="#E8118A" fontFamily="system-ui"
                          letterSpacing="-0.05em"
                          style={{ pointerEvents: 'none' }}>
                          {c.city}
                        </text>
                      </g>
                    </g>
                  )
                })}
              </svg>
            </div>
          </motion.div>

          {/* Panel derecho de cards */}
          <div className="map-cards-col" style={{
            display: 'flex', flexDirection: 'column', gap: '6px',
            overflowY: 'auto', minHeight: 0, paddingRight: '4px',
          }}>
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

            {CITIES.map((c, i) => (
              <CityCard key={c.city} c={c} index={i}
                isActive={isActive(c.city, i)} onToggle={() => toggleManual(c.city)} />
            ))}

            <div style={{ padding: '8px 12px', fontSize: '10px', color: '#BBB', textAlign: 'center', flexShrink: 0 }}>
              {seqDone ? 'Toca un pin para ver sus universidades' : 'Explorando ciudades…'}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!seqDone && (
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            onClick={handleSkip}
            style={{
              position: 'absolute', bottom: '20px', right: '24px',
              padding: '8px 18px', borderRadius: '100px',
              border: '1px solid rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: 700, color: '#555',
              cursor: 'pointer', letterSpacing: '0.04em', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', zIndex: 20,
            }}
          >
            Saltar →
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
