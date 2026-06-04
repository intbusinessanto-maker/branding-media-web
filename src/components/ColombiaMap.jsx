import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/*
  Path generado desde el GeoJSON oficial de Colombia (johan/world.geo.json).
  Proyección:
    lon_min = -78.990935  lon_max = -66.876326  → span = 12.114609
    lat_min = -4.298187   lat_max = 12.437303   → span = 16.735490
    viewBox "0 0 220 260" con 10px de margen
    x = (lon + 78.990935) * (200/12.114609) + 10
    y = (12.437303 - lat) * (240/16.735490) + 10
*/
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
  L 98,207 L 90,203 L 85,196 L 74,189
  Z
`

/*
  Ciudades en las mismas coordenadas de proyección:
  Bogotá      (4.711°N, -74.07°W)  → x=91, y=121
  Medellín    (6.25°N,  -75.56°W)  → x=67, y=99
  Barranquilla(10.96°N, -74.79°W)  → x=79, y=31
  Cali        (3.45°N,  -76.52°W)  → x=51, y=139
*/
const CITIES = [
  {
    city: 'Barranquilla',
    x: 79, y: 31,
    count: 1,
    institutions: ['U. del Norte'],
  },
  {
    city: 'Medellín',
    x: 67, y: 99,
    count: 2,
    institutions: ['UPB Medellín', 'EAFIT'],
  },
  {
    city: 'Bogotá',
    x: 91, y: 121,
    count: 9,
    institutions: [
      'U. del Rosario', 'U. de los Andes', 'U. Externado',
      'Javeriana', 'Sergio Arboleda', 'U. La Sabana',
      'U. La Salle', 'U. Sanitas', 'U. América',
    ],
  },
  {
    city: 'Cali',
    x: 51, y: 139,
    count: 1,
    institutions: ['ICESI'],
  },
]

const GRAD_ID = 'bmMapGrad'

export default function ColombiaMap() {
  const [active, setActive] = useState(null)

  return (
    <section id="mapa" style={{ padding: '100px 2rem', backgroundColor: '#0A0A0A' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px' }}
        >
          <span style={{
            fontSize: '12px', fontWeight: 600, color: '#00C4AD',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            display: 'block', marginBottom: '16px',
          }}>
            Cobertura Nacional
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px',
          }}>
            Presencia en las principales<br />
            <span style={{ color: '#00C4AD' }}>ciudades universitarias</span>
          </h2>
          <p style={{ color: '#555', fontSize: '16px', maxWidth: '520px', lineHeight: 1.7 }}>
            Operamos en 4 ciudades con las instituciones de mayor
            influencia académica y poder adquisitivo de Colombia.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px', alignItems: 'start' }}>

          {/* Mapa SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#0D0D0D',
              border: '1px solid #1E1E1E',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg
              viewBox="5 5 215 252"
              style={{ width: '100%', maxWidth: '420px', height: 'auto' }}
            >
              <defs>
                <linearGradient id={GRAD_ID} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#8B3FA8" />
                  <stop offset="45%"  stopColor="#00C4AD" />
                  <stop offset="100%" stopColor="#F07B00" />
                </linearGradient>
                <filter id="pinGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Sombra del país */}
              <path d={COLOMBIA_PATH} fill="none" stroke="rgba(0,196,173,0.06)" strokeWidth="10" />

              {/* Territorio */}
              <path
                d={COLOMBIA_PATH}
                fill="#131313"
                stroke={`url(#${GRAD_ID})`}
                strokeWidth="1.6"
              />

              {/* Tono interior sutil con gradiente del logo */}
              <path d={COLOMBIA_PATH} fill={`url(#${GRAD_ID})`} opacity="0.04" />

              {/* Marcadores de ciudades */}
              {CITIES.map((c, i) => (
                <g
                  key={c.city}
                  onClick={() => setActive(active?.city === c.city ? null : c)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulso externo */}
                  <motion.circle
                    cx={c.x} cy={c.y} r="14"
                    fill="transparent"
                    stroke={i === 0 ? '#F07B00' : '#00C4AD'}
                    strokeWidth="0.8"
                    animate={{ r: [8, 20], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.65, ease: 'easeOut' }}
                  />
                  {/* Pulso secundario */}
                  <motion.circle
                    cx={c.x} cy={c.y} r="10"
                    fill="transparent"
                    stroke={i === 0 ? '#F07B00' : '#00C4AD'}
                    strokeWidth="0.5"
                    animate={{ r: [5, 14], opacity: [0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.65 + 0.4, ease: 'easeOut' }}
                  />

                  {/* Pin */}
                  <motion.circle
                    cx={c.x} cy={c.y}
                    r={c.count >= 9 ? 10 : c.count >= 2 ? 8 : 7}
                    fill={active?.city === c.city ? `url(#${GRAD_ID})` : '#0D0D0D'}
                    stroke={i === 0 ? '#F07B00' : '#00C4AD'}
                    strokeWidth="2"
                    filter="url(#pinGlow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  />

                  {/* Número */}
                  <motion.text
                    x={c.x} y={c.y + 0.6}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={c.count >= 9 ? '8' : '7'}
                    fontWeight="900"
                    fill={active?.city === c.city ? '#fff' : (i === 0 ? '#F07B00' : '#00C4AD')}
                    fontFamily="system-ui, sans-serif"
                    style={{ pointerEvents: 'none' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.2 }}
                  >
                    {c.count}
                  </motion.text>

                  {/* Etiqueta */}
                  <motion.text
                    x={
                      c.city === 'Barranquilla' ? c.x :
                      c.city === 'Cali'         ? c.x - 12 :
                      c.x + 14
                    }
                    y={
                      c.city === 'Barranquilla' ? c.y - 14 :
                      c.y + 1
                    }
                    textAnchor={
                      c.city === 'Cali'         ? 'end' :
                      c.city === 'Barranquilla' ? 'middle' :
                      'start'
                    }
                    dominantBaseline={c.city === 'Barranquilla' ? 'auto' : 'middle'}
                    fontSize="7"
                    fill="#bbb"
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 + i * 0.2 }}
                  >
                    {c.city}
                  </motion.text>
                </g>
              ))}
            </svg>
          </motion.div>

          {/* Panel lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CITIES.map((c, i) => (
              <motion.div
                key={c.city}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActive(active?.city === c.city ? null : c)}
                style={{
                  padding: '18px 20px',
                  borderRadius: '12px',
                  border: `1px solid ${active?.city === c.city ? '#00C4AD' : '#1E1E1E'}`,
                  backgroundColor: active?.city === c.city ? 'rgba(0,196,173,0.05)' : '#0D0D0D',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: active?.city === c.city ? '12px' : 0,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: active?.city === c.city ? '#00C4AD' : '#fff' }}>
                      {c.city}
                    </div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                      {c.count} {c.count === 1 ? 'institución' : 'instituciones'}
                    </div>
                  </div>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: active?.city === c.city
                      ? 'linear-gradient(135deg, #8B3FA8, #00C4AD)'
                      : '#1A1A1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 900,
                    color: active?.city === c.city ? '#fff' : '#555',
                    flexShrink: 0,
                  }}>
                    {c.count}
                  </div>
                </div>

                <AnimatePresence>
                  {active?.city === c.city && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        listStyle: 'none', padding: 0, margin: 0,
                        display: 'flex', flexDirection: 'column', gap: '5px', overflow: 'hidden',
                      }}
                    >
                      {c.institutions.map((inst, j) => (
                        <motion.li
                          key={inst}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.04 }}
                          style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <span style={{
                            width: '4px', height: '4px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)',
                            flexShrink: 0, display: 'inline-block',
                          }} />
                          {inst}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Total */}
            <div style={{
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid #1E1E1E',
              background: 'linear-gradient(135deg, rgba(139,63,168,0.06), rgba(0,196,173,0.06))',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', color: '#555' }}>Total instituciones</span>
              <span style={{
                fontWeight: 900, fontSize: '22px',
                background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                13+
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
