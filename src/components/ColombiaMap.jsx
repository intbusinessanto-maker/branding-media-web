import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

/*
 * ColombiaMap — rediseño con pines tipo ubicación (📍) y logos universitarios.
 * El mapa SVG de departamentos se mantiene; el mapa 3D HD de referencia
 * se usa como imagen PNG en el bucket de Supabase (sube colombia-map-hd.png
 * cuando tengas el archivo de alta definición).
 * Los pines se escalan al pasar por la secuencia de animación.
 */

const CITIES = [
  {
    city: 'Barranquilla', x: 277.8, y: 67, count: 1,
    institutions: ['U. del Norte'],
    logos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Logo_Uninorte.svg/200px-Logo_Uninorte.svg.png'],
    color: '#E8118A',
  },
  {
    city: 'Cartagena', x: 264.5, y: 94, count: 1,
    institutions: ['U. de los Andes – Sede Caribe'],
    logos: ['https://uniandes.edu.co/sites/default/files/asset/image/logo-uniandes.png'],
    color: '#00C4AD',
  },
  {
    city: 'Bucaramanga', x: 342.7, y: 219.9, count: 1,
    institutions: ['UPB Bucaramanga'],
    logos: ['https://www.upb.edu.co/es/images/logo-upb.png'],
    color: '#00C4AD',
  },
  {
    city: 'Medellín', x: 250.1, y: 217.6, count: 2,
    institutions: ['UPB Medellín', 'EAFIT'],
    logos: [
      'https://www.upb.edu.co/es/images/logo-upb.png',
      'https://www.eafit.edu.co/images/logos/logo-eafit.png',
    ],
    color: '#E8118A',
  },
  {
    city: 'Bogotá', x: 310.6, y: 345.4, count: 9,
    institutions: ['U. del Rosario','U. de los Andes','U. Externado','Javeriana','Sergio Arboleda','U. La Sabana','U. La Salle','U. Sanitas','U. América'],
    logos: [],
    color: '#E8118A',
  },
  {
    city: 'Cali', x: 214.5, y: 344.5, count: 2,
    institutions: ['ICESI', 'Javeriana Cali'],
    logos: [],
    color: '#00C4AD',
  },
]

const STEP_MS = 1200

/* Icono SVG de pin de ubicación */
function PinIcon({ size = 32, color = '#E8118A', active = false }) {
  const s = active ? size * 1.2 : size
  return (
    <svg width={s} height={s * 1.3} viewBox="0 0 24 30" fill="none" style={{ filter: active ? `drop-shadow(0 4px 12px ${color}88)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
      <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 22 8 22s8-16 8-22c0-4.4-3.6-8-8-8z" fill={color} />
      <circle cx="12" cy="8" r="3.5" fill="white" />
    </svg>
  )
}

/* Card de ciudad */
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
        padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
        background: isActive ? `${c.color}08` : '#fff',
        border: `1.5px solid ${isActive ? c.color : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isActive ? `0 4px 20px ${c.color}18` : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isActive ? '12px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PinIcon size={18} color={c.color} active={isActive} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: isActive ? c.color : '#1A1A1A', transition: 'color 0.2s' }}>
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
            background: isActive ? c.color : 'rgba(0,0,0,0.04)',
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

export default function ColombiaMap() {
  const ref        = useRef(null)
  const started    = useRef(false)
  const releaseRef = useRef(null)

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
    <section ref={ref} id="mapa" className="colombia-section" style={{
      height: '100vh', minHeight: '600px', overflow: 'hidden',
      background: 'transparent', display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <style>{`
        .map-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          flex: 1; min-height: 0; align-items: stretch;
        }
        @media (max-width: 900px) {
          .map-grid { grid-template-columns: 1.3fr 1fr; gap: 10px; }
          .map-svg-col { transform: none !important; padding: 12px !important; }
        }
        @media (max-width: 600px) {
          .colombia-section { height: auto !important; min-height: 100svh !important; overflow: visible !important; }
          .map-wrapper { padding: 16px 10px 20px !important; }
          .map-grid { grid-template-columns: 1fr !important; gap: 10px !important; flex: none !important; }
          .map-svg-col { transform: none !important; padding: 8px !important; max-height: 78vw !important; }
          .map-cards-col { overflow-y: visible !important; max-height: none !important; }
        }
        @keyframes pin-bounce {
          0%,100% { transform: translateY(0); }
          40%      { transform: translateY(-8px); }
          70%      { transform: translateY(-3px); }
        }
      `}</style>

      <div className="map-wrapper" style={{
        maxWidth: '1200px', width: '100%', margin: '0 auto',
        padding: '16px 20px 14px',
        display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
      }}>

        {/* Header */}
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

          {/* SVG mapa — con pines de ubicación */}
          <motion.div
            className="map-svg-col"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', background: 'transparent', borderRadius: '20px',
              padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0,
            }}
          >
            <svg viewBox="0 0 613 694" style={{ width: '100%', maxWidth: '460px', height: '100%', maxHeight: '100%' }}>
              {/* Departamentos con degradado claro→oscuro */}
              <g>
                <path d="m 303.16,543.59916 1.41,-0.35 0.82,-0.27 5.34,-1.93 6.54,-2.22 5.06,-1.68 2.87,-0.86 3.41,0.2 2.23,-0.04 0.93,0.48 2.8,1.76 1.81,2.72 3.76,0.43 4.06,-0.11 2.62,-0.02 2.8,2.12 0.76,0.56 1.48,0.68 4.61,-0.38 0.66,-1.18 0.38,-0.89 1.28,-1.33 1.5,0 0.93,0.55 1.02,1.24 0.51,1.04 1.14,0.31 1.1,0.05 1.26,-0.05 1.02,-0.3 1.22,-1.24 2.05,-0.29 1.23,1.48 1.54,1.76 3.67,2.2 1.22,0.07 0.76,-1.46 3.4,-3.61 1.68,-0.13 0.48,1.4 3.07,1.49 0.9,0 1.01,-0.48 1.3,-1.09 -0.13,-2.32 0.29,-0.84 0.74,-1.99 0.69,-1.4 0.49,-0.76 0.84,-0.93 5.51,-5.31 1.08,-0.51 1.13,-0.02 1.12,0.23 2.4,0.65 1.8,0.11 1.53,-1.11 0.8,-1.2 0.56,-0.97 0.38,-0.79 0.52,-1.01 0.46,-0.84 0.74,-0.97 3.44,-2.82 4.09,-4.34 1.61,-1.9 0.5,-1.18 -0.22,-1.64 0.76,-0.62 3.04,0.14 1.89,0.93 0.98,0.75 8.52,5.18 4.11,1.3 1.58,-0.65 2.08,2.2 1.04,1.96 1.69,7.58 1.62,2.64 3.01,-1.22 0.7,-1.33 10.41,3.36 1.61,1.66 0.6,0.94 1.32,1.24 2.75,0.9 1.46,-0.33 -0.72,-1.21 2.46,-1.85 2.02,1.06 0.71,0.92 -1.5,5.54 0.06,4.82 -1.33,2.12 0.06,1.57 1.04,0.9 0.95,0.98 0.34,1.76 -1.08,0.84 -1.42,0.83 -0.27,0.89 0.32,0.98 0.51,0.86 5.07,4.02 1.15,0.09 0.84,-0.36 0.69,-0.77 0.32,-0.95 -0.6,-0.61 -1.19,-0.3 -0.59,-0.66 0.06,-0.84 0.65,-0.88 1.36,-0.88 5.83,-0.39 0.2,1.52 -1.12,3.18 0.29,0.84 1.36,0.23 0.82,-0.3 2.85,-1.32 4.23,-1.02 3.25,2.81 -0.06,0.91 0.78,3.54 6.72,-0.9 -0.14,-3.16 1.01,-2.19 0.44,0.95 0.8,3.72 0.9,4.68 0.47,3.76 -0.51,1.78 -2.54,5.92 -2.88,15.9 -2.95,16.26 -0.56,3.08 -0.75,3.93 -0.39,2.14 -6.5,36.27 -3.66,20.56 -2.53,11.98 -0.56,1.01 0.01,-1.13 -1.32,-1.37 -1.34,-0.91 -0.81,-0.54 -3.39,-2.8 -0.54,-0.89 -0.33,-0.78 -0.34,-1.06 -0.42,-1.27 -0.79,-1.54 -2.17,-2.72 -3.65,-2.95 -0.77,-0.38 -0.85,-0.09 -1.82,0.6 -0.72,0.56 -2.29,1.39 -0.88,0.38 -1.12,0 -3.28,-1.22 -4.8,-2.04 2.14,-3.36 1.84,-2.82 2.54,-3.92 4.89,-7.55 1.44,-2.24 14.21,-22.11 -1.28,-2.34 -0.91,0.13 -3.05,-2.36 -0.59,-1.42 -0.41,-1.6 -3.15,-2.83 -1.66,-0.36 -0.83,0.23 -0.91,0.56 -7.69,-0.75 -0.74,-0.39 -2.77,-3.39 -0.33,-1.76 -8.3,-5.44 -4.84,2.17 -5.14,1.37 -3.58,2 -7.16,-0.56 -2.08,-2.69 -4.45,-1.92 -2.33,0.09 -4.02,-0.48 -0.41,-1.18 0.04,-1.21 -0.41,-0.77 -1.18,0.46 -3.57,2.94 -2.59,3.67 -0.76,2.35 -1.72,0.05 -2.09,-0.39 -3.62,1.57 -6.49,3.73 -2.97,-0.3 -1.16,-0.35 -5.07,-1.7 -5.75,-1.4 -3.84,1.34 -5.41,2.05 -2.77,0.67 -0.85,-2.16 -1.32,-2.2 -1.67,0.07 -1.15,0.36 -2.92,-1.6 -1.27,-1 -0.44,-0.75 -0.68,-3.38 1.26,-0.58 0.97,-1.3 0.8,-2.24 -1.32,-9.09 -1.75,-3.05 -2.65,-1.75 -1.72,1.6 -2.39,1.15 -4.93,-2.34 -3.05,-2.03 -0.7,-0.76 0.84,-3.85 0.42,-0.73 1.23,-1.08 -1.23,-2.36 -1.78,-2.42 -0.94,-1.04 -0.19,-1.29 -0.34,-2.51 -4.03,-3.72 -2.45,-0.22 -1.62,0.44 -3.66,-1.01 -1.11,-2.32 -8.65,-5.56 -5.67,-1.55 -1.04,-0.9 -0.6,-1.07 -1.13,-2.31 0.76,-1.29 0.68,-1.85 -1.75,-1.8 -1.07,-1.15 -0.94,-3.08 -0.79,-3 z" fill="#c43275" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              </g>

              {/* Pines de ubicación por ciudad */}
              {CITIES.map((c, i) => {
                const active = isActive(c.city, i)
                const pinH = active ? 46 : 36
                return (
                  <g key={c.city} onClick={() => toggleManual(c.city)} style={{ cursor: 'pointer' }}>
                    {/* Pulso de expansión cuando activo */}
                    {active && (
                      <>
                        <motion.circle cx={c.x} cy={c.y} r="10" fill="transparent" stroke={c.color} strokeWidth="1.2"
                          animate={{ r: [14, 50], opacity: [0.6, 0] }}
                          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut' }} />
                        <motion.circle cx={c.x} cy={c.y} r="10" fill="transparent" stroke={c.color} strokeWidth="0.8"
                          animate={{ r: [14, 70], opacity: [0.3, 0] }}
                          transition={{ repeat: Infinity, duration: 2.4, delay: 0.6, ease: 'easeOut' }} />
                      </>
                    )}

                    {/* Pin SVG centrado sobre la ciudad */}
                    <foreignObject
                      x={c.x - pinH * 0.5} y={c.y - pinH * 1.25}
                      width={pinH} height={pinH * 1.3}
                      style={{ overflow: 'visible', animation: active ? 'pin-bounce 0.6s ease' : 'none' }}
                    >
                      <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <svg width={pinH} height={pinH * 1.3} viewBox="0 0 24 30" fill="none"
                          style={{ filter: active ? `drop-shadow(0 4px 14px ${c.color}99)` : 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}>
                          <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 22 8 22s8-16 8-22c0-4.4-3.6-8-8-8z" fill={c.color} />
                          <circle cx="12" cy="8" r="3.5" fill="white" />
                          {/* Número de universidades dentro del pin */}
                          {c.count > 1 && (
                            <text x="12" y="10.5" textAnchor="middle" dominantBaseline="middle"
                              fontSize="4.5" fontWeight="900" fill={c.color} fontFamily="system-ui">
                              {c.count}
                            </text>
                          )}
                        </svg>
                      </div>
                    </foreignObject>

                    {/* Número de universidades badge (ciudad con 1 universidad no muestra badge) */}
                    {c.count >= 2 && (
                      <motion.circle cx={c.x + 14} cy={c.y - pinH * 1.2 + 4} r="10" fill="#1A1A1A"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.15, type: 'spring' }} />
                    )}
                    {c.count >= 2 && (
                      <motion.text x={c.x + 14} y={c.y - pinH * 1.2 + 5} textAnchor="middle" dominantBaseline="middle"
                        fontSize="8" fontWeight="900" fill="#fff" fontFamily="system-ui"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.15 }}>
                        {c.count}
                      </motion.text>
                    )}
                  </g>
                )
              })}
            </svg>
          </motion.div>

          {/* Panel derecho — cards de ciudad */}
          <div className="map-cards-col" style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', minHeight: 0, paddingRight: '4px' }}>
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

            {CITIES.map((c, i) => (
              <CityCard key={c.city} c={c} index={i} isActive={isActive(c.city, i)} onToggle={() => toggleManual(c.city)} />
            ))}

            <div style={{ padding: '8px 12px', fontSize: '10px', color: '#BBB', textAlign: 'center', flexShrink: 0 }}>
              {seqDone ? 'Toca un pin para ver sus universidades' : 'Explorando ciudades…'}
            </div>
          </div>
        </div>
      </div>

      {/* Botón Skip */}
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
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              fontSize: '12px', fontWeight: 700, color: '#555', cursor: 'pointer',
              letterSpacing: '0.04em', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', zIndex: 20,
            }}
          >
            Saltar →
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
