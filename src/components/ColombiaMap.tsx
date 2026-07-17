import { useState, useRef, useEffect } from 'react'
import type React from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

// En desktop: sticky 2 scrolls. En mobile: pass-through (la sección crece libremente).
function StickyMapWrapper({ children, mobile }: { children: React.ReactNode; mobile: boolean }) {
  if (mobile) return <>{children}</>
  return (
    <div style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

const MAP_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/mapa%20de%20colombia.png'
const PIN_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/pin%20ubi.png'

/*
 * Posiciones calibradas sobre la imagen de referencia (misma base 425×587 px).
 * xPct = x_pixel / 425 * 100,  yPct = y_pixel / 587 * 100
 * En SVG: px = xPct,  py = yPct * 1.381  (viewBox "0 0 100 138.1")
 */
const CITIES = [
  {
    city: 'Cartagena', xPct: 36.9, yPct: 18.2, count: 1,
    institutions: ['U. de los Andes – Sede Caribe'],
    color: '#E8118A', labelSide: 'left',
  },
  {
    city: 'Barranquilla', xPct: 45.9, yPct: 20.4, count: 1,
    institutions: ['U. del Norte'],
    color: '#E8118A', labelSide: 'right',
  },
  {
    city: 'Bucaramanga', xPct: 47.1, yPct: 31.7, count: 1,
    institutions: ['UPB Bucaramanga'],
    color: '#E8118A', labelSide: 'right',
  },
  {
    city: 'Medellín', xPct: 26.4, yPct: 32.9, count: 2,
    institutions: ['UPB Medellín', 'EAFIT'],
    color: '#E8118A', labelSide: 'left',
  },
  {
    city: 'Bogotá', xPct: 41.9, yPct: 42.6, count: 9,
    institutions: ['U. del Rosario','U. de los Andes','U. Externado','Javeriana','Sergio Arboleda','U. La Sabana','U. La Salle','U. Sanitas','U. América'],
    color: '#E8118A', labelSide: 'right',
  },
  {
    city: 'Cali', xPct: 21.2, yPct: 50.3, count: 2,
    institutions: ['ICESI', 'Javeriana Cali'],
    color: '#E8118A', labelSide: 'left',
  },
]

const STEP_MS = 1200
/* Aspecto del PNG 3D Colombia: 425 / 587 ≈ 0.724, height/width = 1.381 */
const IMG_ASPECT = 425 / 587

interface City { city: string; xPct: number; yPct: number; count: number; institutions: string[]; color: string; labelSide: string }
function CityCard({ c, isActive, onToggle, index }: { c: City; isActive: boolean; onToggle: () => void; index: number }) {
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
        background: isActive ? 'rgba(232,17,138,0.08)' : '#eff2f1',
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
              {c.institutions.map((inst: string, j: number) => (
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
  const isMobile = useIsMobile()
  const ref     = useRef<HTMLDivElement | null>(null)
  const started = useRef(false)
  const relRef  = useRef<(() => void) | null>(null)
  const inView  = useInView(ref, { once: true, amount: 0.15 })

  const [seqIdx,  setSeqIdx]  = useState(-1)
  const [seqDone, setSeqDone] = useState(false)
  const [manual,  setManual]  = useState(new Set())

  const totalInstitutions = CITIES.reduce((s, c) => s + c.count, 0)

  const isActive = (city: string, idx: number) => seqDone ? manual.has(city) : seqIdx === idx

  const toggleManual = (city: string) => {
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
    let timers: ReturnType<typeof setTimeout>[] = [], tDone: ReturnType<typeof setTimeout>
    const t0 = setTimeout(() => {
      timers = CITIES.map((_, i) => setTimeout(() => setSeqIdx(i), i * STEP_MS))
      tDone  = setTimeout(() => { setSeqIdx(-1); setSeqDone(true); release() }, CITIES.length * STEP_MS)
    }, 650)
    return () => { clearTimeout(t0); timers.forEach(clearTimeout); clearTimeout(tDone); release() }
  }, [inView])

  return (
    <StickyMapWrapper mobile={isMobile}>
    <section ref={ref} id="mapa" className="colombia-section" style={{
      height: isMobile ? 'auto' : '100vh', minHeight: '600px', overflow: isMobile ? 'visible' : 'hidden',
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
          .colombia-section { height: auto !important; min-height: unset !important; overflow: visible !important; padding-bottom: clamp(40px,6vh,64px) !important; }
          .map-wrapper { padding: 96px 1.2rem clamp(32px,4vh,48px) !important; }
          .map-grid { grid-template-columns: 1fr !important; gap: 10px !important; flex: none !important; }
          .map-cards-col { overflow-y: visible !important; max-height: none !important; }
          .map-3d-svg { max-width: 340px !important; margin: 0 auto; }
        }
      `}</style>

      <div className="map-wrapper" style={{
        maxWidth: '1200px', width: '100%', margin: '0 auto',
        padding: '96px clamp(1.5rem,4vw,3rem) clamp(32px,4vh,60px)',
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

          {/* ── Mapa 3D Colombia: PNG con bg transparente + SVG de interacción ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="map-3d-wrap"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0, padding: '8px' }}
          >
            <div
              className="map-3d-svg"
              style={{ width: '100%', maxWidth: '460px', flexShrink: 0, position: 'relative' }}
            >
              {/*
               * drop-shadow en CSS con PNG de fondo transparente = la sombra sigue
               * el contorno exacto de Colombia (no un rectángulo), dando el efecto
               * de que el país flota sobre la página con profundidad real.
               * HD: contrast + brightness + saturate suaves potencian el relieve.
               */}
              <div style={{ filter: 'drop-shadow(0 22px 48px rgba(0,0,0,0.28)) drop-shadow(0 6px 14px rgba(0,0,0,0.16))' }}>
                <img
                  src={MAP_URL}
                  alt="Colombia mapa 3D"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'contrast(1.10) brightness(1.02) saturate(1.06)',
                  }}
                />
              </div>

              {/*
               * SVG overlay — pines visuales propios sobre el mapa 3D limpio.
               * viewBox "0 0 100 138.1" → aspecto 425/587 = 0.724, h/w = 1.381
               * px = c.xPct,  py = c.yPct * 1.381,  cy (centro pin) = py - 4.6
               */}
              <svg
                viewBox="0 0 100 138.1"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  <filter id="lbl-sh" x="-12%" y="-30%" width="124%" height="160%">
                    <feDropShadow dx="0" dy="0.4" stdDeviation="0.7" floodColor="#000" floodOpacity="0.18"/>
                  </filter>
                </defs>

                {CITIES.map((c, i) => {
                  const active = isActive(c.city, i)
                  const px = c.xPct
                  const py = c.yPct * 1.381
                  /* Pin PNG: 7×9 SVG units, punta en (px, py).
                   * cy = centro visual (cabeza del pin, ≈72% de la altura desde la punta) */
                  const pinW = 14
                  const pinH = 18
                  const cy   = py - pinH * 0.72

                  const pillW = c.city.length * 1.45 + 3
                  const pillX = c.labelSide === 'right' ? px + 4 : px - 4 - pillW

                  return (
                    <g key={c.city} onClick={() => toggleManual(c.city)} style={{ cursor: 'pointer' }}>

                      {/* Anillos de pulso centrados en la cabeza del pin */}
                      {active && (
                        <>
                          <circle cx={px} cy={cy} r="3" fill="none" stroke="#E8118A" strokeWidth="0.4" opacity="0">
                            <animate attributeName="r" from="3" to="20" dur="2.2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.8" to="0" dur="2.2s" repeatCount="indefinite"/>
                          </circle>
                          <circle cx={px} cy={cy} r="3" fill="none" stroke="#E8118A" strokeWidth="0.25" opacity="0">
                            <animate attributeName="r" from="3" to="32" dur="2.2s" repeatCount="indefinite" begin="0.7s"/>
                            <animate attributeName="opacity" from="0.45" to="0" dur="2.2s" repeatCount="indefinite" begin="0.7s"/>
                          </circle>
                        </>
                      )}

                      {/* Pin como imagen PNG */}
                      <image
                        href={PIN_URL}
                        x={px - pinW / 2}
                        y={py - pinH}
                        width={pinW}
                        height={pinH}
                        style={{ pointerEvents: 'none' }}
                      />

                      {/* Etiqueta ciudad — píldora blanca con texto magenta */}
                      <g filter="url(#lbl-sh)">
                        <rect
                          x={pillX} y={cy - 2.2}
                          width={pillW} height={4.4}
                          rx="1.5" fill="white" opacity="0.96"
                        />
                      </g>
                      <text
                        x={pillX + 1.5} y={cy}
                        dominantBaseline="central"
                        fill="#E8118A" fontSize="2.4" fontWeight="700"
                        fontFamily="system-ui,-apple-system,sans-serif"
                      >{c.city}</text>

                      {/* Área clickeable invisible */}
                      <circle cx={px} cy={cy} r="8" fill="transparent"/>
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
    </StickyMapWrapper>
  )
}
