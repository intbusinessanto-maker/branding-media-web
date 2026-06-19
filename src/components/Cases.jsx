import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { supabase } from '../lib/supabase'

const BASE = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/'

/* Fallback estático mientras carga o si Supabase no responde */
const FALLBACK_IMAGES = [
  'adidas-2.png', 'alkosto.png', 'davivienda.png', 'doggy-home.png',
  'electrolit-1.png', 'gabrica.png', 'hatsu.png', 'heinz.png',
  'kumpet.png', 'little.png', 'mazda.png', 'nescafe.png',
  'samsung-1.png', 'spotify.png', 'todossomosuna-1.png', 'volvo.png', 'yango-1.png',
].map(n => ({ id: n, name: n.replace(/-\d+/, '').replace('.png', ''), logo_url: BASE + n }))

const FALLBACK = ['#8B3FA8', '#00C4AD', '#E8118A']

const BUBBLES = [
  { left: '8%',  top: '4%',  size: 180, fromX: -1600 },
  { left: '8%',  top: '40%', size: 150, fromX: -1600 },
  { left: '8%',  top: '70%', size: 172, fromX: -1600 },
  { left: '19%', top: '6%',  size: 135, fromX: -1100 },
  { left: '19%', top: '54%', size: 163, fromX: -1100 },
  { left: '16%', top: '80%', size: 132, fromX: -1100 },
  { left: '31%', top: '0%',  size: 142, fromX:  -750 },
  { left: '30%', top: '85%', size: 126, fromX:  -750 },
  { left: '43%', top: '90%', size: 122, fromX:  -600 },
  { left: '55%', top: '0%',  size: 155, fromX:   750 },
  { left: '54%', top: '86%', size: 138, fromX:   750 },
  { left: '65%', top: '7%',  size: 162, fromX:  1100 },
  { left: '67%', top: '51%', size: 135, fromX:  1100 },
  { left: '63%', top: '80%', size: 168, fromX:  1100 },
  { left: '76%', top: '3%',  size: 178, fromX:  1600 },
  { left: '77%', top: '36%', size: 146, fromX:  1600 },
  { left: '75%', top: '67%', size: 184, fromX:  1600 },
]

const MOBILE_BUBBLES = [
  // Far left column — entra desde la izquierda
  { left: '-1%', top: '5%',  size: 88, fromX: -700 },
  { left: '0%',  top: '40%', size: 78, fromX: -700 },
  { left: '-1%', top: '74%', size: 84, fromX: -700 },
  // Near left column
  { left: '13%', top: '16%', size: 76, fromX: -450 },
  { left: '12%', top: '52%', size: 82, fromX: -450 },
  { left: '10%', top: '84%', size: 72, fromX: -450 },
  // Top/bottom center-left
  { left: '28%', top: '1%',  size: 86, fromX: -280 },
  { left: '26%', top: '87%', size: 74, fromX: -280 },
  // Bottom center
  { left: '38%', top: '92%', size: 70, fromX: -220 },
  // Top/bottom center-right
  { left: '54%', top: '1%',  size: 86, fromX:  280 },
  { left: '56%', top: '87%', size: 74, fromX:  280 },
  // Near right column
  { left: '67%', top: '16%', size: 76, fromX:  450 },
  { left: '69%', top: '52%', size: 82, fromX:  450 },
  { left: '67%', top: '84%', size: 72, fromX:  450 },
  // Far right column — entra desde la derecha
  { left: '80%', top: '5%',  size: 88, fromX:  700 },
  { left: '82%', top: '40%', size: 78, fromX:  700 },
  { left: '80%', top: '74%', size: 84, fromX:  700 },
]

/* Popup de caso — carga imágenes reales de Supabase */
function CasePopup({ brand, fallback, isOpen, onToggle, popupBelow, size }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !brand?.id) return
    setLoading(true)
    supabase.from('brand_case_images')
      .select('*').eq('brand_id', brand.id).order('sort_order').order('created_at')
      .then(({ data }) => { setImages(data || []); setLoading(false) })
  }, [isOpen, brand?.id])

  if (!isOpen) return null

  const hasImages = images.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.86, y: popupBelow ? -12 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.86, y: popupBelow ? -12 : 12 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute', width: '260px', left: '50%',
        transform: 'translateX(-50%)',
        ...(popupBelow ? { top: size + 14 } : { bottom: size + 14 }),
        background: '#fff', borderRadius: '16px',
        boxShadow: '0 24px 72px rgba(0,0,0,0.18)', overflow: 'hidden',
        zIndex: 70, pointerEvents: 'all',
      }}
    >
      {/* Header */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)', background: '#F8F8F8', flexShrink: 0 }}>
            <img src={brand?.logo_url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>{brand?.name || 'Caso de éxito'}</div>
            <div style={{ fontSize: '10px', color: '#AAA', marginTop: '1px' }}>
              {loading ? 'Cargando…' : hasImages ? `${images.length} imagen${images.length !== 1 ? 'es' : ''}` : 'Caso protegido por NDA'}
            </div>
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); onToggle() }}
          style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F0F0F0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#888', cursor: 'pointer', flexShrink: 0, lineHeight: 1 }}>
          ✕
        </button>
      </div>

      {/* Imágenes */}
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#BBB' }}>Cargando imágenes…</div>
      ) : hasImages ? (
        <div style={{ padding: '10px 12px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
          {images.slice(0, 6).map(img => (
            <div key={img.id} style={{ aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', background: '#F2F2F2', border: '1px solid rgba(0,0,0,0.05)' }}>
              <img src={img.image_url} alt={img.title || ''} loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '16px 14px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
          {[0, 1, 2].map(n => (
            <div key={n} style={{ aspectRatio: '4/3', borderRadius: '10px', background: '#F2F2F2', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '18px', opacity: 0.18 }}>🔒</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '0 14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8B3FA8', background: 'rgba(139,63,168,0.08)', border: '1px solid rgba(139,63,168,0.15)', padding: '3px 8px', borderRadius: '100px' }}>
          NDA protegido
        </span>
        <span style={{ fontSize: '10px', color: '#CCC' }}>Branding Media</span>
      </div>

      {/* Flecha */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', ...(popupBelow ? { top: '-7px' } : { bottom: '-7px' }), width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', ...(popupBelow ? { borderBottom: '7px solid #fff' } : { borderTop: '7px solid #fff' }) }} />
    </motion.div>
  )
}

/* Burbuja individual */
function Bubble({ progress, left, top, size, fromX, brand, fallback, index, isOpen, onToggle }) {
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
        <img src={brand?.logo_url} alt={brand?.name || ''} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14%' }}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = fallback }} />
      </motion.div>
      <AnimatePresence>
        {isOpen && <CasePopup brand={brand} fallback={fallback} isOpen={isOpen} onToggle={onToggle} popupBelow={popupBelow} size={size} />}
      </AnimatePresence>
    </motion.div>
  )
}

/* Header común */
function SectionHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '10px' }}>Resultados</span>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '8px' }}>
        Marcas que <span style={{ color: '#E8118A' }}>confían en nosotros</span>
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
  const [isMobile, setIsMobile]       = useState(false)
  const [brands, setBrands]           = useState(FALLBACK_IMAGES)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Cargar marcas visibles de Supabase */
  useEffect(() => {
    supabase.from('brands').select('id,name,logo_url').eq('visible', true).order('created_at')
      .then(({ data }) => { if (data?.length) setBrands(data) })
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const handleToggle = i => setActiveIndex(prev => prev === i ? null : i)
  const handleClose  = ()  => setActiveIndex(null)

  /* ── LAYOUT MÓVIL — misma animación de burbujas que desktop ── */
  if (isMobile) {
    return (
      <section ref={ref} id="casos" style={{ height: '200vh', position: 'relative' }}>
        <div
          style={{ position: 'sticky', top: 0, height: '100vh', background: 'transparent', overflow: 'hidden' }}
          onClick={handleClose}
        >
          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(3px)', zIndex: 55, pointerEvents: 'none' }} />
            )}
          </AnimatePresence>

          {MOBILE_BUBBLES.map((b, i) => (
            <Bubble key={i} index={i} progress={scrollYProgress}
              left={b.left} top={b.top} size={b.size} fromX={b.fromX}
              brand={brands[i]} fallback={FALLBACK[i % 3]}
              isOpen={activeIndex === i} onToggle={() => handleToggle(i)} />
          ))}

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
            <div style={{ textAlign: 'center', padding: '0 2rem' }}>
              <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '8px' }}>
                Resultados
              </motion.span>
              <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.07 }}
                style={{ fontSize: 'clamp(1.6rem, 7vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '6px' }}>
                Marcas que <span style={{ color: '#E8118A' }}>confían en nosotros</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.13 }}
                style={{ color: '#AAA', fontSize: '11px', lineHeight: 1.5 }}>
                Toca una marca para ver su caso de éxito
              </motion.p>
            </div>
          </div>
        </div>
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
            brand={brands[i]} fallback={FALLBACK[i % 3]}
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
              Marcas que <span style={{ color: '#E8118A' }}>confían en nosotros</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.13 }}
              style={{ color: '#AAA', fontSize: '12px', lineHeight: 1.6 }}>
              Haz clic en una marca para ver su caso de éxito
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
