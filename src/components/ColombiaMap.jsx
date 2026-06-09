import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

const CITIES = [
  {
    city: 'Barranquilla', x: 79, y: 31, count: 1,
    institutions: ['U. del Norte'],
    color: '#F07B00',
  },
  {
    city: 'Cartagena', x: 70, y: 46, count: 1,
    institutions: ['U. de los Andes'],
    color: '#8B3FA8',
  },
  {
    city: 'Bucaramanga', x: 107, y: 86, count: 1,
    institutions: ['UPB Bucaramanga'],
    color: '#00C4AD',
  },
  {
    city: 'Medellín', x: 67, y: 99, count: 2,
    institutions: ['UPB Medellín', 'EAFIT'],
    color: '#F07B00',
  },
  {
    city: 'Bogotá', x: 91, y: 121, count: 9,
    institutions: [
      'U. del Rosario', 'U. de los Andes', 'U. Externado',
      'Javeriana', 'Sergio Arboleda', 'U. La Sabana',
      'U. La Salle', 'U. Sanitas', 'U. América',
    ],
    color: '#8B3FA8',
  },
  {
    city: 'Cali', x: 51, y: 139, count: 1,
    institutions: ['ICESI'],
    color: '#00C4AD',
  },
]

export default function ColombiaMap() {
  const [active, setActive] = useState(null)

  const totalInstitutions = CITIES.reduce((s, c) => s + c.count, 0)

  return (
    <section id="mapa" style={{ padding: '100px 2rem', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ marginBottom: '56px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '10px' }}>
            Cobertura Nacional
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '12px' }}>
            Presencia en las principales<br />
            <span style={{ color: '#8B3FA8' }}>ciudades universitarias</span>
          </h2>
          <p style={{ color: '#888', fontSize: '15px', maxWidth: '480px', lineHeight: 1.65 }}>
            Operamos en 6 ciudades con las instituciones de mayor influencia académica de Colombia.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'start' }}>

          {/* Mapa */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            style={{
              background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '20px', padding: '32px',
              display: 'flex', justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}>
            <svg viewBox="5 5 215 252" style={{ width: '100%', maxWidth: '380px', height: 'auto' }}>
              <defs>
                <linearGradient id="colGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B3FA8" />
                  <stop offset="50%" stopColor="#00C4AD" />
                  <stop offset="100%" stopColor="#F07B00" />
                </linearGradient>
              </defs>

              {/* Territorio */}
              <path d={COLOMBIA_PATH} fill="#F5F5F5" stroke="url(#colGrad2)" strokeWidth="1.6" />

              {/* Marcadores */}
              {CITIES.map((c, i) => (
                <g key={c.city}
                  onClick={() => setActive(active?.city === c.city ? null : c)}
                  style={{ cursor: 'pointer' }}>

                  {/* Pulso */}
                  <motion.circle cx={c.x} cy={c.y} r="8"
                    fill="transparent" stroke={c.color} strokeWidth="0.8"
                    animate={{ r: [6, 18], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4, ease: 'easeOut' }} />

                  {/* Pin */}
                  <motion.circle
                    cx={c.x} cy={c.y}
                    r={c.count >= 9 ? 10 : c.count >= 2 ? 8 : 7}
                    fill={active?.city === c.city ? c.color : '#fff'}
                    stroke={c.color} strokeWidth="2"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} />

                  {/* Número */}
                  <motion.text
                    x={c.x} y={c.y + 0.5}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={c.count >= 9 ? '7.5' : '7'}
                    fontWeight="900"
                    fill={active?.city === c.city ? '#fff' : c.color}
                    fontFamily="system-ui" style={{ pointerEvents: 'none' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15 }}>
                    {c.count}
                  </motion.text>

                  {/* Etiqueta */}
                  <motion.text
                    x={
                      c.city === 'Barranquilla' ? c.x :
                      c.city === 'Cartagena'    ? c.x - 12 :
                      c.city === 'Cali'         ? c.x - 12 :
                      c.x + 13
                    }
                    y={
                      c.city === 'Barranquilla' ? c.y - 13 :
                      c.city === 'Cartagena'    ? c.y + 1 :
                      c.y + 1
                    }
                    textAnchor={
                      c.city === 'Cartagena' || c.city === 'Cali' ? 'end' :
                      c.city === 'Barranquilla' ? 'middle' : 'start'
                    }
                    dominantBaseline={c.city === 'Barranquilla' ? 'auto' : 'middle'}
                    fontSize="6.5" fill="#555" fontFamily="system-ui" fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.15 }}>
                    {c.city}
                  </motion.text>
                </g>
              ))}
            </svg>
          </motion.div>

          {/* Lista lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CITIES.map((c, i) => (
              <motion.div key={c.city}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.3, duration: 0.55 }}
                onClick={() => setActive(active?.city === c.city ? null : c)}
                whileHover={{ y: -2, boxShadow: `0 6px 20px ${c.color}20` }}
                style={{
                  padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                  background: '#fff',
                  border: `1px solid ${active?.city === c.city ? c.color : 'rgba(0,0,0,0.07)'}`,
                  boxShadow: active?.city === c.city ? `0 4px 16px ${c.color}20` : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.2s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: active?.city === c.city ? '10px' : 0 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: active?.city === c.city ? c.color : '#1A1A1A' }}>{c.city}</div>
                    <div style={{ fontSize: '11px', color: '#AAA', marginTop: '1px' }}>
                      {c.count} {c.count === 1 ? 'institución' : 'instituciones'}
                    </div>
                  </div>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                    background: active?.city === c.city ? c.color : 'rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 900,
                    color: active?.city === c.city ? '#fff' : '#AAA',
                  }}>{c.count}</div>
                </div>

                <AnimatePresence>
                  {active?.city === c.city && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ listStyle: 'none', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {c.institutions.map((inst, j) => (
                        <motion.li key={inst}
                          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.04 }}
                          style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: c.color, flexShrink: 0, display: 'inline-block' }} />
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
              padding: '12px 16px', borderRadius: '10px',
              background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', color: '#AAA' }}>Total instituciones</span>
              <span style={{
                fontWeight: 900, fontSize: '20px',
                background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{totalInstitutions}+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


