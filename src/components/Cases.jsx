import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { supabase } from '../lib/supabase'

const BASE     = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/'
const FONDO_URL = `${BASE}Fondo%202.png`

const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

/* Fallback estático mientras carga o si Supabase no responde */
const FALLBACK_IMAGES = [
  'adidas-2.png', 'alkosto.png', 'davivienda.png', 'doggy-home.png',
  'electrolit-1.png', 'gabrica.png', 'hatsu.png', 'heinz.png',
  'kumpet.png', 'little.png', 'mazda.png', 'nescafe.png',
  'samsung-1.png', 'spotify.png', 'todossomosuna-1.png', 'volvo.png', 'yango-1.png',
].map(n => ({ id: n, name: n.replace(/-\d+/, '').replace('.png', ''), logo_url: BASE + n }))

const FALLBACK = ['#8B3FA8', '#00C4AD', '#E8118A']

const BUBBLES = [
  /* ── originales (17) ── */
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
  { left: '65%', top: '24%', size: 148, fromX:  1100 },
  { left: '67%', top: '51%', size: 135, fromX:  1100 },
  { left: '63%', top: '80%', size: 168, fromX:  1100 },
  { left: '76%', top: '3%',  size: 178, fromX:  1600 },
  { left: '77%', top: '36%', size: 146, fromX:  1600 },
  { left: '75%', top: '67%', size: 184, fromX:  1600 },
  /* ── extensión para marcas adicionales (18-32) ── */
  { left: '24%', top: '22%', size: 138, fromX:  -950 },
  { left: '23%', top: '65%', size: 126, fromX:  -950 },
  { left: '35%', top: '8%',  size: 130, fromX:  -680 },
  { left: '34%', top: '78%', size: 132, fromX:  -680 },
  { left: '45%', top: '3%',  size: 124, fromX:  -520 },
  { left: '44%', top: '95%', size: 118, fromX:  -520 },
  { left: '58%', top: '6%',  size: 128, fromX:   520 },
  { left: '57%', top: '92%', size: 122, fromX:   520 },
  { left: '70%', top: '20%', size: 148, fromX:   950 },
  { left: '71%', top: '68%', size: 140, fromX:   950 },
  { left: '84%', top: '12%', size: 160, fromX:  1550 },
  { left: '83%', top: '52%', size: 148, fromX:  1550 },
  { left: '84%', top: '82%', size: 155, fromX:  1550 },
  { left: '12%', top: '30%', size: 142, fromX: -1300 },
  { left: '11%', top: '58%', size: 136, fromX: -1300 },
]

/*
 * MOBILE_BUBBLES — distribución orgánica, no grid.
 * Burbujas principalmente en bordes (izq/der) y zonas arriba/abajo del título.
 * Título ocupa aprox y=32-62% del viewport. Bordes: solo y=25-68% en lados extremos.
 * Verificadas sin solapamiento: min_dist > sum_radii en todos los pares cercanos.
 */
const MOBILE_BUBBLES = [
  /* ── Zona superior (y: 5-24%) — bajadas para quedar cerca del título ── */
  { left: '2%',  top: '8%',  size: 80, fromX: -680 },
  { left: '54%', top: '7%',  size: 72, fromX:  380 },
  { left: '78%', top: '5%',  size: 82, fromX:  700 },
  { left: '27%', top: '12%', size: 66, fromX: -220 },
  { left: '63%', top: '15%', size: 70, fromX:  440 },
  { left: '10%', top: '20%', size: 74, fromX: -560 },
  { left: '43%', top: '22%', size: 64, fromX:  160 },

  /* ── Bordes izq/der (y: 26-65%) — parcialmente fuera pero visibles ── */
  { left: '-2%', top: '28%', size: 78, fromX: -680 },
  { left: '-3%', top: '47%', size: 72, fromX: -680 },
  { left: '-2%', top: '63%', size: 76, fromX: -680 },
  { left: '80%', top: '30%', size: 78, fromX:  700 },
  { left: '82%', top: '48%', size: 70, fromX:  700 },
  { left: '80%', top: '65%', size: 76, fromX:  700 },

  /* ── Zona inferior (y: 70-95%) ── */
  { left: '3%',  top: '74%', size: 78, fromX: -680 },
  { left: '26%', top: '78%', size: 68, fromX: -240 },
  { left: '50%', top: '80%', size: 72, fromX:  200 },
  { left: '67%', top: '74%', size: 70, fromX:  480 },
  { left: '80%', top: '83%', size: 74, fromX:  700 },
  { left: '14%', top: '87%', size: 66, fromX: -520 },
  { left: '56%', top: '91%', size: 68, fromX:  400 },
  { left: '36%', top: '93%', size: 64, fromX: -140 },

  /* ── Extra para marcas adicionales ── */
  { left: '82%', top: '20%', size: 60, fromX:  700 },
  { left: '7%',  top: '38%', size: 62, fromX: -600 },
  { left: '74%', top: '40%', size: 58, fromX:  640 },
  { left: '6%',  top: '55%', size: 60, fromX: -620 },
  { left: '76%', top: '58%', size: 58, fromX:  620 },
]

/* Popup de caso — modal centrado con carrusel horizontal */
function CasePopup({ brand, isOpen, onToggle }) {
  const [images, setImages]   = useState([])
  const [loading, setLoading] = useState(false)
  const [idx, setIdx]         = useState(0)
  const trackRef              = useRef(null)

  useEffect(() => {
    if (!isOpen || !brand?.id) return
    setIdx(0)
    setLoading(true)
    supabase.from('brand_case_images')
      .select('*').eq('brand_id', brand.id).order('sort_order').order('created_at')
      .then(({ data }) => { setImages(data || []); setLoading(false) })
  }, [isOpen, brand?.id])

  if (!isOpen) return null

  const items    = images.length > 0 ? images : null
  const total    = items ? items.length : 3
  const canPrev  = idx > 0
  const canNext  = items ? idx < items.length - 1 : false

  const scrollTo = (newIdx) => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: newIdx * trackRef.current.clientWidth, behavior: 'smooth' })
    setIdx(newIdx)
  }

  const arrowBtn = (dir) => ({
    all: 'unset', cursor: 'pointer', position: 'absolute', top: '50%',
    transform: 'translateY(-50%)',
    ...(dir === -1 ? { left: 10 } : { right: 10 }),
    width: 38, height: 38, borderRadius: '50%',
    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: '#1A1A1A', lineHeight: 1, zIndex: 5,
  })

  return (
    /* Overlay — fixed, centrado */
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={e => { e.stopPropagation(); onToggle() }}
      style={{ position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px' }}
    >
      {/* Card centrada */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '22px', overflow: 'hidden',
          width: 'min(700px, 96vw)', boxShadow: '0 32px 90px rgba(0,0,0,0.30)' }}
      >
        {/* Header con logo de la marca */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#F8F8F8',
              border: '2px solid rgba(0,0,0,0.07)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={brand?.logo_url} alt="" loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '7px' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A1A' }}>{brand?.name}</div>
              <div style={{ fontSize: '12px', color: '#AAA', marginTop: '2px' }}>
                {loading ? 'Cargando…' : items ? `${items.length} imagen${items.length !== 1 ? 'es' : ''}` : 'Caso protegido por NDA'}
              </div>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); onToggle() }}
            style={{ all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%',
              background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: '#666' }}>
            ✕
          </button>
        </div>

        {/* Carrusel */}
        <div style={{ position: 'relative', background: '#F5F5F5' }}>
          {loading ? (
            <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 13, color: '#CCC' }}>
              Cargando imágenes…
            </div>
          ) : (
            <>
              {/* Track deslizable */}
              <style>{`.cases-carousel::-webkit-scrollbar{display:none}`}</style>
              <div
                ref={trackRef}
                className="cases-carousel"
                onScroll={e => {
                  const w = e.target.clientWidth
                  if (w) setIdx(Math.round(e.target.scrollLeft / w))
                }}
                style={{ display: 'flex', overflowX: 'scroll', scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {items ? items.map((img) => (
                  <div key={img.id} style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start',
                    aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img src={img.image_url} alt={img.title || ''} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none' }} />
                  </div>
                )) : [0,1,2].map(n => (
                  <div key={n} style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start',
                    aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 32, opacity: 0.15 }}>🔒</span>
                  </div>
                ))}
              </div>

              {/* Flechas de navegación */}
              {canPrev && (
                <button style={arrowBtn(-1)} onClick={() => scrollTo(idx - 1)}>‹</button>
              )}
              {canNext && (
                <button style={arrowBtn(1)} onClick={() => scrollTo(idx + 1)}>›</button>
              )}
            </>
          )}
        </div>

        {/* Dots + footer */}
        <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Indicadores de posición */}
          {items && items.length > 1 ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {items.map((_, i) => (
                <button key={i} onClick={() => scrollTo(i)}
                  style={{ all: 'unset', cursor: 'pointer', height: 6, borderRadius: 3, transition: 'all 0.22s',
                    width: i === idx ? 18 : 6,
                    background: i === idx ? '#8B3FA8' : '#DDD' }} />
              ))}
            </div>
          ) : <span />}
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#8B3FA8',
            background: 'rgba(139,63,168,0.08)', border: '1px solid rgba(139,63,168,0.15)',
            padding: '4px 10px', borderRadius: 100, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            NDA protegido
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* Burbuja individual — NO renderiza el popup (el transform del motion.div rompe position:fixed) */
function Bubble({ progress, left, top, size, fromX, brand, fallback, index, isOpen, onToggle }) {
  const rawX    = useTransform(progress, [0, 0.20, 0.80, 1], [fromX, 0, 0, fromX])
  const x       = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.6 })
  const opacity = useTransform(progress, [0.04, 0.18, 0.82, 0.96], [0, 1, 1, 0])
  const scale   = useTransform(progress, [0, 0.20, 0.80, 1], [0.25, 1, 1, 0.25])

  return (
    <motion.div
      style={{ position: 'absolute', left, top, width: size, height: size, x, opacity, scale,
        zIndex: isOpen ? 20 : index % 3, cursor: 'pointer', willChange: 'transform, opacity' }}
      onClick={e => { e.stopPropagation(); onToggle() }}
    >
      <motion.div whileHover={{ scale: 1.07 }} transition={{ duration: 0.2 }}
        style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
          border: isOpen ? '3px solid #8B3FA8' : '3px solid rgba(255,255,255,0.96)',
          boxShadow: isOpen ? '0 0 0 4px rgba(139,63,168,0.18), 0 16px 48px rgba(0,0,0,0.18)' : '0 8px 32px rgba(0,0,0,0.12)',
          background: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
        <img src={brand?.logo_url} alt={brand?.name || ''} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8%' }}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = fallback }} />
      </motion.div>
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
  const [activeBrand, setActiveBrand] = useState(null)
  const [isMobile, setIsMobile]       = useState(IS_MOBILE_INIT)
  const [brands, setBrands]           = useState(FALLBACK_IMAGES)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* Fetch diferido: solo cuando la sección está a ~1000px del viewport.
     Evita un setState en el mount inicial que recrea 26 springs simultáneamente. */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        supabase.from('brands').select('id,name,logo_url').eq('visible', true).order('created_at')
          .then(({ data }) => { if (data?.length) setBrands(data) })
      },
      { rootMargin: '1000px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const handleToggle = (brand) => setActiveBrand(prev => prev?.id === brand?.id ? null : brand)
  const handleClose  = () => setActiveBrand(null)

  const pool   = isMobile ? MOBILE_BUBBLES : BUBBLES
  const subset = brands.slice(0, pool.length)

  /* ── SHARED SECTION STRUCTURE ── */
  return (
    <section ref={ref} id="casos" style={{ height: '200vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: isMobile ? 'hidden' : 'visible',
          background: isMobile ? `url(${FONDO_URL}) center/cover no-repeat` : 'transparent',
        }}
        onClick={handleClose}
      >
        {/* Burbujas */}
        {subset.map((brand, i) => {
          const b = pool[i]
          return (
            <Bubble key={brand.id || i} index={i} progress={scrollYProgress}
              left={b.left} top={b.top} size={b.size} fromX={b.fromX}
              brand={brand} fallback={FALLBACK[i % 3]}
              isOpen={activeBrand?.id === brand.id}
              onToggle={() => handleToggle(brand)} />
          )
        })}

        {/* Título centrado — zIndex 10 en móvil para quedar siempre sobre las burbujas */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: isMobile ? 10 : 2, pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', padding: '0 1.5rem', width: '100%' }}>
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: '#888', display: 'block',
                marginBottom: isMobile ? '8px' : '12px' }}>
              Resultados
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.07 }}
              style={{ fontSize: isMobile ? 'clamp(1.6rem,7vw,2.2rem)' : 'clamp(1.8rem,3.5vw,2.8rem)',
                fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A',
                lineHeight: 1.1, marginBottom: isMobile ? '6px' : '8px' }}>
              Marcas que <span style={{ color: '#E8118A' }}>confían en nosotros</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.13 }}
              style={{ color: '#333', fontSize: isMobile ? '11px' : '12px', lineHeight: 1.6 }}>
              {isMobile ? 'Toca una marca para ver su caso de éxito' : 'Haz clic en una marca para ver su caso de éxito'}
            </motion.p>
          </div>
        </div>
      </div>

      {/*
       * El popup se renderiza AQUÍ — fuera del motion.div de las burbujas.
       * position:fixed funciona correctamente porque ningún ancestro tiene transform.
       */}
      <AnimatePresence>
        {activeBrand && (
          <CasePopup brand={activeBrand} isOpen={true} onToggle={handleClose} />
        )}
      </AnimatePresence>
    </section>
  )
}
