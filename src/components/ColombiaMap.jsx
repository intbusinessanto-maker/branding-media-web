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

const CITIES = [
  { city: 'Barranquilla', x: 79,  y: 31,  count: 1, institutions: ['U. del Norte'],     color: '#E8118A' },
  { city: 'Cartagena',    x: 70,  y: 46,  count: 1, institutions: ['U. de los Andes'],  color: '#8B3FA8' },
  { city: 'Bucaramanga',  x: 107, y: 86,  count: 1, institutions: ['UPB Bucaramanga'],  color: '#00C4AD' },
  { city: 'Medellín',     x: 67,  y: 99,  count: 2, institutions: ['UPB Medellín', 'EAFIT'], color: '#E8118A' },
  {
    city: 'Bogotá', x: 91, y: 121, count: 9,
    institutions: ['U. del Rosario','U. de los Andes','U. Externado','Javeriana','Sergio Arboleda','U. La Sabana','U. La Salle','U. Sanitas','U. América'],
    color: '#8B3FA8',
  },
  { city: 'Cali', x: 51, y: 139, count: 1, institutions: ['ICESI'], color: '#00C4AD' },
]

/* Tarjeta de ciudad — se auto-expande al entrar al viewport */
function CityCard({ c, isActive, onToggle, onReveal, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.75 })

  useEffect(() => {
    if (inView) onReveal()
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
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
          <div style={{ fontWeight: 700, fontSize: '14px', color: isActive ? c.color : '#1A1A1A', transition: 'color 0.2s' }}>{c.city}</div>
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

export default function ColombiaMap() {
  const [activeCities, setActiveCities] = useState(new Set())
  const totalInstitutions = CITIES.reduce((s, c) => s + c.count, 0)

  const toggle = (cityName) => {
    setActiveCities(prev => {
      const next = new Set(prev)
      if (next.has(cityName)) next.delete(cityName)
      else next.add(cityName)
      return next
    })
  }

  const reveal = (cityName) => {
    setActiveCities(prev => new Set([...prev, cityName]))
  }

  return (
    <section id="mapa" style={{ padding: 'clamp(80px, 10vw, 120px) 1.5rem', background: 'transparent' }}>
      <style>{`
        .map-layout-new {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .map-layout-new { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '48px' }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '10px' }}>
            Cobertura Nacional
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.08, marginBottom: '14px' }}>
            Presencia en las principales{' '}
            <span style={{ color: '#8B3FA8' }}>ciudades universitarias</span>
          </h2>
          <p style={{ color: '#888', fontSize: '15px', maxWidth: '520px', lineHeight: 1.65 }}>
            Operamos en 6 ciudades con las instituciones de mayor influencia académica de Colombia.
            Haz clic en una ciudad para ver las universidades.
          </p>
        </motion.div>

        <div className="map-layout-new">

          {/* Mapa SVG — grande con efecto 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '24px',
              padding: 'clamp(24px, 5vw, 48px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.07), 0 40px 80px rgba(0,0,0,0.06)',
              transform: 'perspective(1000px) rotateX(3deg)',
              transformOrigin: 'top center',
              minHeight: '520px',
            }}
          >
            {/* Glow de fondo sutil */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '24px', pointerEvents: 'none',
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,63,168,0.04) 0%, transparent 70%)',
            }} />

            <svg viewBox="5 5 215 252" style={{ width: '100%', maxWidth: '520px', height: 'auto', minHeight: '360px' }}>
              <defs>
                <linearGradient id="colGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B3FA8" />
                  <stop offset="55%" stopColor="#00C4AD" />
                  <stop offset="100%" stopColor="#E8118A" />
                </linearGradient>
                <filter id="mapShadow">
                  <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.12)" />
                </filter>
              </defs>

              {/* Sombra del país */}
              <path d={COLOMBIA_PATH} fill="rgba(0,0,0,0.04)" transform="translate(3,6)" />

              {/* País principal */}
              <path
                d={COLOMBIA_PATH}
                fill="#F7F7F7"
                stroke="url(#colGrad3D)"
                strokeWidth="1.8"
                filter="url(#mapShadow)"
              />

              {CITIES.map((c, i) => {
                const isActive = activeCities.has(c.city)
                return (
                  <g key={c.city} onClick={() => toggle(c.city)} style={{ cursor: 'pointer' }}>
                    {/* Pulso animado */}
                    <motion.circle
                      cx={c.x} cy={c.y} r="8"
                      fill="transparent"
                      stroke={c.color}
                      strokeWidth="0.9"
                      animate={{ r: [6, 22], opacity: [0.7, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.45, ease: 'easeOut' }}
                    />
                    {/* Segunda onda */}
                    <motion.circle
                      cx={c.x} cy={c.y} r="8"
                      fill="transparent"
                      stroke={c.color}
                      strokeWidth="0.5"
                      animate={{ r: [6, 30], opacity: [0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.45 + 0.5, ease: 'easeOut' }}
                    />
                    {/* Dot principal */}
                    <motion.circle
                      cx={c.x} cy={c.y}
                      r={c.count >= 9 ? 11 : c.count >= 2 ? 9 : 7.5}
                      fill={isActive ? c.color : '#fff'}
                      stroke={c.color}
                      strokeWidth="2.2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                    {/* Número */}
                    <motion.text
                      x={c.x} y={c.y + 0.5}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={c.count >= 9 ? '8' : '7.5'}
                      fontWeight="900"
                      fill={isActive ? '#fff' : c.color}
                      fontFamily="system-ui"
                      style={{ pointerEvents: 'none' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                    >
                      {c.count}
                    </motion.text>
                    {/* Label ciudad */}
                    <motion.text
                      x={c.city === 'Barranquilla' ? c.x : c.city === 'Cartagena' ? c.x - 13 : c.city === 'Cali' ? c.x - 13 : c.x + 15}
                      y={c.city === 'Barranquilla' ? c.y - 14 : c.city === 'Cartagena' ? c.y + 1 : c.y + 1}
                      textAnchor={c.city === 'Cartagena' || c.city === 'Cali' ? 'end' : c.city === 'Barranquilla' ? 'middle' : 'start'}
                      dominantBaseline={c.city === 'Barranquilla' ? 'auto' : 'middle'}
                      fontSize="6.5" fill={isActive ? c.color : '#666'}
                      fontFamily="system-ui" fontWeight="700"
                      style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.15 }}
                    >
                      {c.city}
                    </motion.text>
                  </g>
                )
              })}
            </svg>
          </motion.div>

          {/* Panel derecho — lista de ciudades */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Total badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                padding: '16px 20px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(139,63,168,0.07) 0%, rgba(0,196,173,0.07) 100%)',
                border: '1px solid rgba(139,63,168,0.15)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total red</div>
                <div style={{ fontSize: '11px', color: '#AAA', marginTop: '1px' }}>6 ciudades activas</div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#8B3FA8', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {totalInstitutions}+
              </div>
            </motion.div>

            {/* Cards de ciudad */}
            {CITIES.map((c, i) => (
              <CityCard
                key={c.city}
                c={c}
                index={i}
                isActive={activeCities.has(c.city)}
                onToggle={() => toggle(c.city)}
                onReveal={() => reveal(c.city)}
              />
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              style={{ padding: '12px 16px', fontSize: '11px', color: '#BBB', textAlign: 'center', lineHeight: 1.5 }}
            >
              Las ciudades se expanden automáticamente al desplazarte
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
