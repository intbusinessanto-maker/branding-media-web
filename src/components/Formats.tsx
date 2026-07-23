import { useEffect, useRef, useState } from 'react'
import type React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useIsMobile } from '../hooks/useIsMobile'

const STATUE_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/estatua%20megafono.png'
const FONDO_URL  = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'

const formats = [
  {
    tag: 'Digital', title: 'DOOH', subtitle: 'Digital Out-of-Home',
    description: 'Pantallas LED de alta resolución en zonas de alto tráfico dentro de los campus universitarios.',
    features: ['Contenido dinámico en tiempo real', 'Programación por horario', 'Actualización remota', 'Métricas de impacto'],
    color: '#00C4AD', bg: 'rgba(0,196,173,0.06)', border: 'rgba(0,196,173,0.15)',
  },
  {
    tag: 'Físico', title: 'OOH', subtitle: 'Out-of-Home',
    description: 'Vallas, backlight, stickers de piso, mupis y activaciones presenciales en universidades.',
    features: ['Presencia permanente en campus', 'Alta recordación de marca', 'Formatos adaptables', 'Impacto visual diferencial'],
    color: '#E8118A', bg: 'rgba(232,17,138,0.06)', border: 'rgba(232,17,138,0.15)',
  },
  {
    tag: 'Experiencial', title: 'Activaciones', subtitle: 'Brand Experience',
    description: 'Intervenciones en vivo: stands, muestras, concursos y experiencias que generan engagement real.',
    features: ['Interacción directa', 'Generación UGC', 'Sampling y demos', 'Medición de engagement'],
    color: '#8B3FA8', bg: 'rgba(139,63,168,0.06)', border: 'rgba(139,63,168,0.15)',
  },
]

interface FormatItem { tag: string; title: string; subtitle: string; description: string; features: string[]; color: string; bg: string; border: string }
interface FormatExample { id: string; image_url: string; brand_name?: string; logo_url?: string }

/* ── Popup ── */
function FormatPopup({ format, onClose }: { format: FormatItem; onClose: () => void }) {
  const [examples, setExamples] = useState<FormatExample[]>([])
  const [loading, setLoading]   = useState(true)
  const [lightbox, setLightbox] = useState<FormatExample | null>(null)

  useEffect(() => {
    supabase.from('format_examples')
      .select('*').eq('format_type', format.title).order('sort_order').order('created_at')
      .then(({ data }) => { setExamples((data as FormatExample[]) || []); setLoading(false) })
  }, [format.title])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="format-popup-overlay"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end',
        justifyContent: 'center', background: 'rgba(0,0,0,0.655)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <style>{`
        .format-popup-overlay { padding: 0 0 clamp(40px,8vh,60px); }
        .format-popup-sheet   { max-height: 78vh; border-radius: 24px; }
        @media (min-width: 768px) {
          .format-popup-overlay { padding: 0; }
          .format-popup-sheet   { max-height: calc(100vh - 68px); border-radius: 24px 24px 0 0; }
        }
      `}</style>
      <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="format-popup-sheet"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '1100px', background: '#fff', padding: '28px 36px 40px', overflowY: 'auto', boxShadow: '0 -8px 48px rgba(0,0,0,0.20)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: format.color, display: 'block', marginBottom: 4 }}>{format.tag}</span>
            <h3 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.03em', margin: 0 }}>Ejemplos de {format.title}</h3>
          </div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#555', flexShrink: 0 }}>✕</button>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#AAA', padding: '40px 0', fontSize: 14 }}>Cargando…</p>
        ) : examples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📷</div>
            <p style={{ fontSize: 14, color: '#AAA', margin: 0 }}>Próximamente</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
            {examples.map(ex => (
              <motion.div key={ex.id} whileHover={{ y: -3 }} onClick={() => setLightbox(ex)}
                style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', background: '#F8F8F8' }}>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#EEE' }}>
                  <img src={ex.image_url} alt={ex.brand_name || ''} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    onMouseEnter={e => (e.target as HTMLImageElement).style.transform = 'scale(1.05)'}
                    onMouseLeave={e => (e.target as HTMLImageElement).style.transform = 'scale(1)'}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
                {ex.brand_name && (
                  <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ex.logo_url && <img src={ex.logo_url} alt={ex.brand_name} loading="lazy" style={{ width: 22, height: 22, objectFit: 'contain', background: '#fff', borderRadius: '50%', padding: 2, border: '1px solid #EEE', flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{ex.brand_name}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.img initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
              src={lightbox.image_url} alt="" style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
            <button onClick={() => setLightbox(null)} style={{ all: 'unset', position: 'fixed', top: 20, right: 24, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Card de formato (compartida desktop + mobile) ── */
function FormatCard({ f, visibleCount, idx, isMobile, onClick }: {
  f: FormatItem; visibleCount: number; idx: number; isMobile: boolean; onClick: () => void
}) {
  const visible = idx < visibleCount
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.55, delay: visible ? idx * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{ height: isMobile ? 'auto' : '100%', cursor: 'pointer' }}
    >
      <div style={{
        padding: isMobile ? '12px' : 'clamp(18px,2.2vw,28px)',
        borderRadius: '14px',
        background: '#fff',
        border: `1px solid ${f.border}`,
        borderLeft: isMobile ? undefined : `4px solid ${f.color}`,
        borderTop: isMobile ? `4px solid ${f.color}` : undefined,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '10px',
        height: isMobile ? undefined : '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ fontSize: isMobile ? '8px' : '10px', fontWeight: 700, color: f.color, background: f.bg, border: `1px solid ${f.border}`, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.tag}</span>
          <span style={{ fontSize: isMobile ? '10px' : '11px', color: f.color, fontWeight: 600 }}>Ver →</span>
        </div>
        <div>
          <h3 style={{ fontSize: isMobile ? 'clamp(1.1rem,4.5vw,1.4rem)' : 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, color: f.color, letterSpacing: '-0.04em', marginBottom: '3px', lineHeight: 1 }}>{f.title}</h3>
          <p style={{ fontSize: isMobile ? '10px' : '11px', color: '#888', fontWeight: 600, marginBottom: '6px', margin: isMobile ? '0' : undefined }}>{f.subtitle}</p>
          <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#555', lineHeight: 1.6, margin: 0 }}>{f.description}</p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: isMobile ? '3px' : '5px', marginTop: isMobile ? undefined : 'auto' }}>
          {f.features.map(feat => (
            <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '5px' : '7px', fontSize: isMobile ? '10px' : '11px', color: '#666' }}>
              <span style={{ width: isMobile ? '4px' : '5px', height: isMobile ? '4px' : '5px', borderRadius: '50%', background: f.color, flexShrink: 0, marginTop: isMobile ? '3px' : '4px' }} />
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

/* ── Sección principal ── */
export default function Formats() {
  const [activeFormat, setActiveFormat] = useState<FormatItem | null>(null)
  const isMobile = useIsMobile()

  // Desktop: sticky scroll reveal
  const [visibleCount, setVisibleCount] = useState(0)
  const desktopWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isMobile) return
    const wrapper = desktopWrapperRef.current
    if (!wrapper) return
    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      const scrolled = -rect.top
      if (scrolled <= 0) { setVisibleCount(0); return }
      const stepH = window.innerHeight
      const count = Math.min(formats.length, Math.floor(scrolled / stepH) + 1)
      setVisibleCount(Math.max(0, count))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  // Mobile: dots sincronizan con el scroll nativo del carrusel
  const [activeIdx, setActiveIdx] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollToIdx = (i: number) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  const onCarouselScroll = () => {
    const el = carouselRef.current
    if (!el) return
    setActiveIdx(Math.round(el.scrollLeft / el.clientWidth))
  }

  // ── DESKTOP ──
  const DesktopSection = (
    <section id="formatos" style={{
      position: 'relative', height: '100vh', overflow: 'hidden',
      background: '#eff2f1', display: 'flex', alignItems: 'center',
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 'clamp(260px,32vw,480px)', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        <img src={STATUE_URL} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom left', display: 'block' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 2, width: '100%', paddingLeft: 'clamp(240px,30vw,460px)', paddingRight: 'clamp(1.5rem,3vw,3rem)', paddingTop: 'clamp(80px,10vh,120px)', paddingBottom: 'clamp(120px,18vh,200px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vh,56px)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Formatos</span>
          <h2 style={{ fontSize: 'clamp(1.6rem,3.2vw,2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, margin: 0 }}>
            Medios que <span style={{ color: '#00C4AD' }}>capturan atención</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(10px,1.4vw,18px)', alignItems: 'stretch' }}>
          {formats.map((f, i) => (
            <FormatCard key={f.title} f={f} visibleCount={visibleCount} idx={i} isMobile={false} onClick={() => setActiveFormat(f)} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {visibleCount === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none', zIndex: 10 }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', fontWeight: 600 }}>scroll</span>
            <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)', animation: 'fm-scroll 2s ease-in-out infinite' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )

  // ── MOBILE: muñeco fijo izq + carrusel nativo der ──
  const MobileSection = (
    <section id="formatos" style={{
      background: '#eff2f1',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
      paddingTop: '96px', paddingBottom: '16px',
      overflow: 'hidden', position: 'relative',
    }}>
      <style>{`
        .fm-cards::-webkit-scrollbar { display: none; }
        .fm-cards { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '8px 16px 8px', flexShrink: 0 }}>
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 4 }}>Formatos</span>
        <h2 style={{ fontSize: 'clamp(1.2rem,5vw,1.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, margin: 0 }}>
          Medios que <span style={{ color: '#00C4AD' }}>capturan atención</span>
        </h2>
      </div>

      {/* Cuerpo: estatua fija izq + carrusel der */}
      <div style={{ display: 'flex', alignItems: 'flex-end', position: 'relative' }}>

        {/* Estatua — no participa en el scroll */}
        <div style={{ flexShrink: 0, width: '38%', alignSelf: 'flex-end', pointerEvents: 'none', zIndex: 2 }}>
          <img src={STATUE_URL} alt="" loading="lazy" style={{
            width: '100%', height: 'auto', maxHeight: '52vw',
            objectFit: 'contain', objectPosition: 'bottom left', display: 'block',
          }} />
        </div>

        {/* Carrusel nativo — ocupa el 62% restante */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', paddingTop: '8px', paddingBottom: '12px' }}>
          <div
            ref={carouselRef}
            className="fm-cards"
            onScroll={onCarouselScroll}
            style={{
              display: 'flex',
              overflowX: 'scroll',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              paddingRight: '12px',
            }}
          >
            {formats.map((f) => (
              <div
                key={f.title}
                style={{ flex: '0 0 100%', scrollSnapAlign: 'start', boxSizing: 'border-box', paddingLeft: '4px' }}
              >
                <div
                  onClick={() => setActiveFormat(f)}
                  style={{
                    padding: '12px', borderRadius: '14px', background: '#fff',
                    border: `1px solid ${f.border}`, borderTop: `4px solid ${f.color}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                    display: 'flex', flexDirection: 'column', gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8px', fontWeight: 800, color: f.color, background: f.bg, border: `1px solid ${f.border}`, padding: '3px 8px', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.tag}</span>
                    <span style={{ fontSize: '10px', color: f.color, fontWeight: 700 }}>Ver →</span>
                  </div>
                  <h3 style={{ fontSize: 'clamp(1.1rem,4.5vw,1.4rem)', fontWeight: 900, color: f.color, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>{f.title}</h3>
                  <p style={{ fontSize: '10px', color: '#888', fontWeight: 600, margin: 0 }}>{f.subtitle}</p>
                  <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.5, margin: 0 }}>{f.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {f.features.map(feat => (
                      <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '10px', color: '#666' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: f.color, flexShrink: 0, marginTop: '3px' }} />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingTop: '10px' }}>
            {formats.map((f, i) => (
              <div key={f.title} onClick={() => scrollToIdx(i)} style={{
                height: 5, borderRadius: 3, transition: 'all 0.3s ease', cursor: 'pointer',
                width: i === activeIdx ? 22 : 5,
                background: i === activeIdx ? f.color : 'rgba(0,0,0,0.18)',
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <>
      <style>{`@keyframes fm-scroll { 0%,100%{opacity:.8;transform:scaleY(1)} 50%{opacity:.2;transform:scaleY(.35)} }`}</style>

      {isMobile ? (
        MobileSection
      ) : (
        <div ref={desktopWrapperRef} style={{ height: `${(formats.length + 1) * 100}vh`, position: 'relative' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
            {DesktopSection}
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeFormat && <FormatPopup format={activeFormat} onClose={() => setActiveFormat(null)} />}
      </AnimatePresence>
    </>
  )
}
