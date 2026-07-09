import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import type React from 'react'
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

/*
 * BUBBLES — posiciones verificadas algorítmicamente (relajación física)
 * para que ningún par de burbujas se solape entre sí en viewport 1280x800,
 * incluyendo las de "extensión" que antes no se chequeaban contra las originales
 * (causaba choques tipo Electrolit/Casa Toro). Zona central (35-65% / 30-70%)
 * se mantiene libre para el título.
 */
const BUBBLES = [
  { left: '6%',  top: '9%',  size: 180, fromX: -1600 },
  { left: '5%',  top: '40%', size: 150, fromX: -1600 },
  { left: '5%',  top: '70%', size: 172, fromX: -1600 },
  { left: '21%', top: '11%', size: 135, fromX: -1100 },
  { left: '21%', top: '48%', size: 163, fromX: -1100 },
  { left: '18%', top: '76%', size: 132, fromX: -1100 },
  { left: '30%', top: '10%', size: 142, fromX:  -750 },
  { left: '28%', top: '80%', size: 126, fromX:  -750 },
  { left: '40%', top: '74%', size: 122, fromX:  -600 },
  { left: '54%', top: '10%', size: 155, fromX:   750 },
  { left: '51%', top: '72%', size: 138, fromX:   750 },
  { left: '61%', top: '28%', size: 148, fromX:  1100 },
  { left: '67%', top: '45%', size: 135, fromX:  1100 },
  { left: '66%', top: '74%', size: 168, fromX:  1100 },
  { left: '76%', top: '10%', size: 178, fromX:  1600 },
  { left: '77%', top: '36%', size: 146, fromX:  1600 },
  { left: '78%', top: '62%', size: 184, fromX:  1600 },
  { left: '25%', top: '30%', size: 138, fromX:  -950 },
  { left: '23%', top: '65%', size: 126, fromX:  -950 },
  { left: '36%', top: '13%', size: 130, fromX:  -680 },
  { left: '33%', top: '64%', size: 132, fromX:  -680 },
  { left: '44%', top: '3%',  size: 124, fromX:  -520 },
  { left: '48%', top: '84%', size: 118, fromX:  -520 },
  { left: '60%', top: '11%', size: 128, fromX:   520 },
  { left: '57%', top: '84%', size: 122, fromX:   520 },
  { left: '72%', top: '19%', size: 148, fromX:   950 },
  { left: '67%', top: '58%', size: 140, fromX:   950 },
  { left: '86%', top: '15%', size: 160, fromX:  1550 },
  { left: '85%', top: '50%', size: 148, fromX:  1550 },
  { left: '87%', top: '79%', size: 155, fromX:  1550 },
  { left: '13%', top: '26%', size: 142, fromX: -1300 },
  { left: '11%', top: '58%', size: 136, fromX: -1300 },
]

/*
 * MOBILE_BUBBLES — posiciones calculadas con algoritmo de relajación física
 * (separación entre burbujas + repulsión desde el rectángulo del título)
 * para: (1) eliminar los huecos grandes arriba/abajo del título — las
 * burbujas quedan empacadas justo hasta el borde del texto, (2) ninguna
 * burbula se corta en los bordes de pantalla (antes Kumpet/Little Caesars
 * quedaban con left negativo y se veían cortadas), (3) cero solapamientos
 * entre burbujas ni con la zona del título (verificado algorítmicamente).
 */
/*
 * MOBILE_BUBBLES — scatter orgánico alrededor del título central.
 * Índices pares = TOP (0-30%), índices impares = BOTTOM (62-90%).
 * Ninguna burbuja queda a la misma altura que sus vecinas horizontales.
 */
/*
 * MOBILE_BUBBLES — top reorganizado para que las burbujas queden visibles:
 * TOP: entre 18%–38% (justo encima del título, por debajo del header de la app)
 * BOT: entre 62%–88% (justo debajo del título)
 */
/*
 * MOBILE_BUBBLES — TOP: 8%–32%, BOT: 62%–91%
 * Adidas [0] left:1% top:8% size:70  →  Mazda [2] left:25% top:14% size:64 — sin solape
 */
const MOBILE_BUBBLES = [
  { left: '1%',  top: '13%', size: 70, fromX: -600 }, // [0]  Adidas  TOP
  { left: '4%',  top: '63%', size: 74, fromX: -600 }, // [1]  BOT
  { left: '4%',  top: '24%', size: 64, fromX: -400 }, // [2]  Mazda   TOP  fila 2 izq
  { left: '72%', top: '62%', size: 70, fromX:  600 }, // [3]  BOT
  { left: '38%', top: '13%', size: 72, fromX:  500 }, // [4]  Electrolit TOP fila 1
  { left: '36%', top: '70%', size: 72, fromX:  300 }, // [5]  BOT
  { left: '65%', top: '11%', size: 62, fromX:  400 }, // [6]  Hatsu  TOP fila 1
  { left: '14%', top: '74%', size: 68, fromX: -500 }, // [7]  BOT
  { left: '83%', top: '13%', size: 66, fromX:  600 }, // [8]  Kumpet TOP fila 1
  { left: '58%', top: '75%', size: 74, fromX:  500 }, // [9]  BOT
  { left: '21%', top: '18%', size: 68, fromX: -500 }, // [10] Samsung TOP fila 2
  { left: '80%', top: '80%', size: 66, fromX:  600 }, // [11] BOT
  { left: '52%', top: '24%', size: 66, fromX:  400 }, // [12] Yango  TOP fila 2
  { left: '2%',  top: '85%', size: 70, fromX: -600 }, // [13] BOT
  { left: '25%', top: '32%', size: 70, fromX: -400 }, // [14] TOP fila 3 izq
  { left: '30%', top: '82%', size: 68, fromX: -300 }, // [15] BOT
  { left: '68%', top: '22%', size: 58, fromX:  400 }, // [16] CasaToro TOP fila 2 der
  { left: '62%', top: '87%', size: 64, fromX:  500 }, // [17] BOT
  { left: '47%', top: '33%', size: 62, fromX:  500 }, // [18] TOP fila 3 centro
  { left: '20%', top: '90%', size: 60, fromX: -400 }, // [19] BOT
  { left: '84%', top: '30%', size: 64, fromX:  600 }, // [20] TOP fila 3 der
  { left: '60%', top: '88%', size: 58, fromX:  400 }, // [21] BOT
  { left: '8%',  top: '38%', size: 66, fromX: -500 }, // [22] TOP fila 4 izq
  { left: '83%', top: '85%', size: 56, fromX:  600 }, // [23] BOT
  { left: '74%', top: '38%', size: 62, fromX:  600 }, // [24] TOP fila 4 der
  { left: '38%', top: '91%', size: 54, fromX: -300 }, // [25] BOT
]

interface Brand { id: string; name: string; logo_url?: string; image_url?: string }
interface CaseImage { id: string; image_url: string; title?: string }

/* Popup de caso — modal centrado con carrusel horizontal */
function CasePopup({ brand, isOpen, onToggle }: { brand: Brand | null; isOpen: boolean; onToggle: () => void }) {
  const [images, setImages]   = useState<CaseImage[]>([])
  const [loading, setLoading] = useState(false)
  const [idx, setIdx]         = useState(0)
  const trackRef              = useRef<HTMLDivElement | null>(null)

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

  const scrollTo = (newIdx: number) => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: newIdx * trackRef.current.clientWidth, behavior: 'smooth' })
    setIdx(newIdx)
  }

  const arrowBtn = (dir: number): React.CSSProperties => ({
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
          width: 'min(700px, 96vw)',
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 90px rgba(0,0,0,0.30)' }}
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
        <div style={{ position: 'relative', background: '#F5F5F5', flex: '1 1 auto', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center',
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
                  const t = e.target as HTMLDivElement
                  if (t.clientWidth) setIdx(Math.round(t.scrollLeft / t.clientWidth))
                }}
                style={{ display: 'flex', overflowX: 'scroll', scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {items ? items.map((img) => (
                  <div key={img.id} style={{
                    flexShrink: 0, width: '100%', scrollSnapAlign: 'start',
                    background: '#1A1A1A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={img.image_url} alt={img.title || ''} loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 'calc(100vh - 180px)',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )) : [0,1,2].map(n => (
                  <div key={n} style={{ flexShrink: 0, width: '100%', scrollSnapAlign: 'start',
                    height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#1A1A1A' }}>
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
function Bubble({ progress, left, top, size, fromX, brand, fallback, index, isOpen, onToggle }: {
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  left: string; top: string; size: number; fromX: number
  brand: Brand | undefined; fallback: string; index: number
  isOpen: boolean; onToggle: () => void
}) {
  const rawX    = useTransform(progress, [0, 0.20], [fromX, 0])
  const x       = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.6 })
  /* Fade-in al entrar, fade-out suave al salir — evita que las burbujas de arriba "desaparezcan" abruptamente */
  const opacity = useTransform(progress, [0.04, 0.18, 0.82, 1.0], [0, 1, 1, 0])
  const scale   = useTransform(progress, [0, 0.20], [0.25, 1])

  return (
    <motion.div
      style={{ position: 'absolute', left, top, width: size, height: size, x, opacity, scale,
        zIndex: isOpen ? 20 : 1, cursor: 'pointer', willChange: 'transform, opacity' }}
      onClick={e => { e.stopPropagation(); onToggle() }}
    >
      <motion.div whileHover={{ scale: 1.07 }} transition={{ duration: 0.2 }}
        style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
          border: isOpen ? '3px solid #8B3FA8' : '3px solid rgba(255,255,255,0.96)',
          boxShadow: isOpen ? '0 0 0 4px rgba(139,63,168,0.18), 0 16px 48px rgba(0,0,0,0.18)' : '0 8px 32px rgba(0,0,0,0.12)',
          background: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
        <img src={brand?.logo_url} alt={brand?.name || ''} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8%' }}
          onError={e => { const t = e.target as HTMLImageElement; t.style.display = 'none'; if (t.parentElement) t.parentElement.style.background = fallback }} />
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
  const ref = useRef<HTMLDivElement | null>(null)
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null)
  const [isMobile, setIsMobile]       = useState(IS_MOBILE_INIT)
  const [brands, setBrands]           = useState<Brand[]>(FALLBACK_IMAGES)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
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
  const handleToggle = (brand: Brand) => setActiveBrand(prev => prev?.id === brand?.id ? null : brand)
  const handleClose  = () => setActiveBrand(null)

  const pool   = isMobile ? MOBILE_BUBBLES : BUBBLES
  const subset = brands.slice(0, pool.length)

  /* ── SHARED SECTION STRUCTURE ── */
  return (
    <section ref={ref} id="casos" style={{ height: '100vh', position: 'relative', overflow: 'hidden',
      background: isMobile ? `url(${FONDO_URL}) center/cover no-repeat` : 'transparent' }}
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
