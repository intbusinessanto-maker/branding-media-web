import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

const BASE = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/'

const IMAGES = [
  'adidas-2.png', 'alkosto.png', 'davivienda.png', 'doggy-home.png',
  'electrolit-1.png', 'gabrica.png', 'hatsu.png', 'heinz.png',
  'kumpet.png', 'little.png', 'mazda.png', 'nescafe.png',
  'samsung-1.png', 'spotify.png', 'todossomosuna-1.png', 'volvo.png', 'yango-1.png',
].map(n => BASE + n)

const FALLBACK = ['#8B3FA8', '#00C4AD', '#F07B00']

const BUBBLES = [
  { left: '0%',  top: '4%',  size: 155, fromX: -1600 },
  { left: '0%',  top: '40%', size: 128, fromX: -1600 },
  { left: '0%',  top: '70%', size: 148, fromX: -1600 },
  { left: '12%', top: '6%',  size: 114, fromX: -1100 },
  { left: '12%', top: '54%', size: 140, fromX: -1100 },
  { left: '9%',  top: '80%', size: 112, fromX: -1100 },
  { left: '23%', top: '0%',  size: 122, fromX:  -750 },
  { left: '22%', top: '85%', size: 108, fromX:  -750 },
  { left: '43%', top: '90%', size: 104, fromX:  -600 },
  { left: '67%', top: '0%',  size: 132, fromX:   750 },
  { left: '66%', top: '86%', size: 118, fromX:   750 },
  { left: '76%', top: '7%',  size: 138, fromX:  1100 },
  { left: '78%', top: '51%', size: 114, fromX:  1100 },
  { left: '74%', top: '80%', size: 144, fromX:  1100 },
  { left: '88%', top: '3%',  size: 152, fromX:  1600 },
  { left: '89%', top: '36%', size: 124, fromX:  1600 },
  { left: '87%', top: '67%', size: 158, fromX:  1600 },
]

const cases = [
  { sector: 'FMCG',    tag: 'DOOH · Bogotá',        color: '#00C4AD', headline: 'Incremento del 40% en reconocimiento de marca', m1: { l: 'Impactos', v: '1.2M+' }, m2: { l: 'Duración',  v: '8 sem' } },
  { sector: 'Fintech', tag: 'OOH · Nacional',        color: '#F07B00', headline: 'Adquisición de usuarios en audiencia 18–25',    m1: { l: 'Ciudades',  v: '4'    }, m2: { l: 'Registros', v: '12K+'  } },
  { sector: 'Retail',  tag: 'Activación · Medellín', color: '#8B3FA8', headline: '3.000 interacciones directas con la marca',    m1: { l: 'Interacc.', v: '3K+'  }, m2: { l: 'UGC posts', v: '800+'  } },
]

/* Popup de caso */
function CasePopup({ imgUrl, fallback, isOpen, onToggle, popupBelow, size }) {
  if (!isOpen) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86, y: popupBelow ? -12 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.86, y: popupBelow ? -12 : 12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', width: '240px', left: '50%',
        transform: 'translateX(-50%)',
        ...(popupBelow ? { top: size + 14 } : { bottom: size + 14 }),
        background: '#fff', borderRadius: '16px',
        boxShadow: '0 24px 72px rgba(0,0,0,0.18)', overflow: 'hidden',
        zIndex: 70, pointerEvents: 'all',
      }}
    >
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)', background: '#F8F8F8', flexShrink: 0 }}>
            <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>Caso de éxito</div>
            <div style={{ fontSize: '10px', color: '#AAA', marginTop: '1px' }}>Imágenes próximamente</div>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onToggle() }}
          style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F0F0F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#888', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}>
          ✕
        </button>
      </div>
      <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
        {[0, 1, 2].map(n => (
          <div key={n} style={{ aspectRatio: '4/3', borderRadius: '10px', background: '#F2F2F2', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
            <img src={imgUrl} alt="" style={{ width: '55%', height: '55%', objectFit: 'contain', opacity: 0.35 }} />
            <div style={{ position: 'absolute', bottom: '5px', right: '6px', fontSize: '9px', color: '#CCC' }}>⊞</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B3FA8', background: 'rgba(139,63,168,0.08)', border: '1px solid rgba(139,63,168,0.15)', padding: '3px 8px', borderRadius: '100px' }}>
          NDA protegido
        </span>
        <span style={{ fontSize: '10px', color: '#CCC' }}>Branding Media</span>
      </div>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', ...(popupBelow ? { top: '-7px' } : { bottom: '-7px' }), width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', ...(popupBelow ? { borderBottom: '7px solid #fff' } : { borderTop: '7px solid #fff' }) }} />
    </motion.div>
  )
}

/* Burbuja individual — solo para desktop */
function Bubble({ progress, left, top, size, fromX, imgUrl, fallback, index, isOpen, onToggle }) {
  const rawX    = useTransform(progress, [0, 0.20, 0.80, 1], [fromX, 0, 0, fromX])
  const x       = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.6 })
  const opacity = useTransform(progress, [0.04, 0.18, 0.82, 0.96], [0, 1, 1, 0])
  const scale   = useTransform(progress, [0, 0.20, 0.80, 1], [0.25, 1, 1, 0.25])
  const popupBelow = parseFloat(top) < 38

  return (
    <motion.div
      style={{ position: 'absolute', left, top, width: size, height: size, x, opacity, scale, zIndex: isOpen ? 60 : index % 3, cursor: 'pointer', willChange: 'transform, opacity' }}
      onClick={e => { e.stopPropagation(); onToggle() }}
    >
      <motion.div whileHover={{ scale: 1.07 }} transition={{ duration: 0.2 }}
        style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: isOpen ? '3px solid #8B3FA8' : '3px solid rgba(255,255,255,0.96)', boxShadow: isOpen ? '0 0 0 4px rgba(139,63,168,0.18), 0 16px 48px rgba(0,0,0,0.18)' : '0 8px 32px rgba(0,0,0,0.12)', background: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
        <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14%' }}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = fallback }} />
      </motion.div>
      <AnimatePresence>
        {isOpen && <CasePopup imgUrl={imgUrl} fallback={fallback} isOpen={isOpen} onToggle={onToggle} popupBelow={popupBelow} size={size} />}
      </AnimatePresence>
    </motion.div>
  )
}

/* Tarjeta de caso — reutilizada en ambos layouts */
function CaseCard({ c }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 14px 36px ${c.color}20`, transition: { duration: 0.2 } }}
      style={{ padding: '20px', borderRadius: '14px', background: '#fff', border: `1px solid ${c.color}22`, boxShadow: `0 4px 16px ${c.color}10`, textAlign: 'left' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '4px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, background: `${c.color}0F`, border: `1px solid ${c.color}22`, padding: '3px 10px', borderRadius: '100px' }}>{c.sector}</span>
        <span style={{ fontSize: '10px', color: '#CCC' }}>{c.tag}</span>
      </div>
      <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.35, marginBottom: '14px' }}>{c.headline}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${c.color}18` }}>
        {[c.m1, c.m2].map(m => (
          <div key={m.l}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: c.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{m.v}</div>
            <div style={{ fontSize: '11px', color: '#CCC', marginTop: '2px' }}>{m.l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* Header común */
function SectionHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '10px' }}>Resultados</span>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '8px' }}>
        Marcas que <span style={{ color: '#F07B00' }}>confían en nosotros</span>
      </h2>
      <p style={{ color: '#AAA', fontSize: '13px', lineHeight: 1.6 }}>
        Resultados reales — marcas protegidas por acuerdo de confidencialidad
      </p>
    </motion.div>
  )
}

export default function Cases() {
  const ref = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const handleToggle = i => setActiveIndex(prev => prev === i ? null : i)
  const handleClose  = ()  => setActiveIndex(null)

  /* Renderiza una fila de logos circulares para móvil */
  const LogoRow = ({ slice, offset = 0 }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
      {slice.map((url, idx) => {
        const i = offset + idx
        return (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => { e.stopPropagation(); handleToggle(i) }}
            style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0, cursor: 'pointer' }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#fff', border: activeIndex === i ? '2.5px solid #8B3FA8' : '2px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 14px rgba(0,0,0,0.09)' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '15%' }}
                onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = FALLBACK[i % 3] }} />
            </div>
            <AnimatePresence>
              {activeIndex === i && (
                <CasePopup imgUrl={url} fallback={FALLBACK[i % 3]} isOpen onToggle={() => handleToggle(i)} popupBelow size={60} />
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )

  /* ── LAYOUT MÓVIL ── */
  if (isMobile) {
    const topLogos    = IMAGES.slice(0, 9)   // 9 primeros
    const bottomLogos = IMAGES.slice(9)      // 8 últimos

    return (
      <section id="casos" ref={ref} style={{ padding: '72px 1.5rem', background: 'transparent' }} onClick={handleClose}>

        {/* Fila superior de logos */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}>
          <LogoRow slice={topLogos} offset={0} />
        </motion.div>

        {/* Header + tarjetas en el centro */}
        <div style={{ marginBottom: '32px' }}>
          <SectionHeader />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            {cases.map((c, i) => (
              <motion.div key={c.sector}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <CaseCard c={c} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fila inferior de logos */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <LogoRow slice={bottomLogos} offset={9} />
        </motion.div>

      </section>
    )
  }

  /* ── LAYOUT DESKTOP — scroll animation ── */
  return (
    <section ref={ref} id="casos" style={{ height: '200vh', position: 'relative' }}>
      <div
        style={{ position: 'sticky', top: 0, height: '100vh', background: 'transparent' }}
        onClick={handleClose}
      >
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(3px)', zIndex: 55, pointerEvents: 'none' }} />
          )}
        </AnimatePresence>

        {BUBBLES.map((b, i) => (
          <Bubble key={i} index={i} progress={scrollYProgress}
            left={b.left} top={b.top} size={b.size} fromX={b.fromX}
            imgUrl={IMAGES[i]} fallback={FALLBACK[i % 3]}
            isOpen={activeIndex === i} onToggle={() => handleToggle(i)} />
        ))}

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', padding: '0 1.5rem', width: '100%' }}>
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>
              Resultados
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.07 }}
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '8px' }}>
              Marcas que <span style={{ color: '#F07B00' }}>confían en nosotros</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.13 }}
              style={{ color: '#AAA', fontSize: '12px', marginBottom: '28px', lineHeight: 1.6 }}>
              Resultados reales — marcas protegidas por acuerdo de confidencialidad
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.18 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', pointerEvents: 'all' }}>
              {cases.map(c => <CaseCard key={c.sector} c={c} />)}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
