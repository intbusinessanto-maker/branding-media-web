import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar        from './components/Navbar'
import VideoIntro    from './components/VideoIntro'
import Hero          from './components/Hero'
import Stats         from './components/Stats'
import BrandCarousel from './components/BrandCarousel'
import CinematicText from './components/CinematicText'
import ColombiaMap   from './components/ColombiaMap'
import LogoShowcase  from './components/LogoShowcase'
import Formats       from './components/Formats'
import Audience      from './components/NewspaperAudience'
import Cases         from './components/Cases'
import Comparison    from './components/Comparison'
import Blog          from './components/Blog'
import Contact       from './components/Contact'
import Footer        from './components/Footer'
import BlogPage      from './pages/BlogPage'

const PAGE_BG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'

/*
 * matchMedia es más fiable que innerWidth — usa exactamente la misma lógica
 * que las CSS media queries, incluyendo zoom del sistema y DPR correctos.
 */
const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

/* Solo desktop: cursor personalizado con RAF loop */
function CustomCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    let x = -100, y = -100
    let cx = -100, cy = -100
    let rafId

    const onMove = (e) => { x = e.clientX; y = e.clientY }
    const onLeave = () => { x = -100; y = -100 }

    const tick = () => {
      cx += (x - cx) * 0.85
      cy += (y - cy) * 0.85
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cx}px, ${cy}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '14px', height: '14px',
        marginLeft: '-7px', marginTop: '-7px',
        borderRadius: '50%', backgroundColor: '#fff',
        mixBlendMode: 'difference', pointerEvents: 'none',
        zIndex: 99999, willChange: 'transform',
      }}
    />
  )
}

/*
 * Solo desktop: fondo de papel con parallax de mouse.
 * En móvil NO se renderiza — en iOS los elementos position:fixed crean capas GPU
 * independientes que pueden aparecer sobre el contenido normal, lo que causaba
 * que el fondo de periódico (Fondo 2.png) se viera en el Hero en lugar del video.
 */
function InteractiveBackground() {
  const bgRef = useRef(null)

  useEffect(() => {
    let px = 0.5, py = 0.5
    let cpx = 0.5, cpy = 0.5
    let rafId

    const onMove = (e) => {
      px = e.clientX / window.innerWidth
      py = e.clientY / window.innerHeight
    }

    const tick = () => {
      cpx += (px - cpx) * 0.038
      cpy += (py - cpy) * 0.038
      if (bgRef.current) {
        const dx = (cpx - 0.5) * -22
        const dy = (cpy - 0.5) * -22
        bgRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={bgRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `url(${PAGE_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        willChange: 'transform',
      }}
    />
  )
}

export default function App() {
  /* Routing simple sin react-router — detecta /blog en el pathname */
  const isBlogPage = typeof window !== 'undefined' && window.location.pathname === '/blog'
  if (isBlogPage) return <BlogPage />

  const [introVisible, setIntroVisible] = useState(
    () => !sessionStorage.getItem('bm_intro_seen')
  )
  /*
   * Solo el Hero renderiza en t=0 (una sección, sin hooks de Framer Motion).
   * Todo lo demás monta cuando el browser está idle o tras 700ms máximo.
   * requestIdleCallback se adapta a la carga real del dispositivo; el fallback
   * garantiza que en iOS < 15 (sin rIC) se use setTimeout como respaldo.
   * Sin esto, los >100 motion values + fetch de Supabase del render inicial
   * saturan el hilo principal y retrasan los IO callbacks de whileInView,
   * haciendo que nada aparezca hasta que el usuario llega a Comparison.
   */
  const [deferred, setDeferred] = useState(false)
  useEffect(() => {
    const mount = () => setDeferred(true)
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(mount, { timeout: 700 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(mount, 600)
    return () => clearTimeout(id)
  }, [])

  /*
   * matchMedia: mismo mecanismo que CSS. Se suscribe a cambios (orientación, zoom)
   * para mantener el valor correcto sin polling. useLayoutEffect corre antes del
   * primer paint → nunca se renderiza InteractiveBackground en móvil.
   */
  const [isMobile, setIsMobile] = useState(IS_MOBILE_INIT)
  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <>
      {introVisible && (
        <VideoIntro onDismiss={() => {
          sessionStorage.setItem('bm_intro_seen', '1')
          setIntroVisible(false)
        }} />
      )}

      <div style={{ minHeight: '100vh', position: 'relative' }}>
        {!isMobile && <CustomCursor />}
        {!isMobile && <InteractiveBackground />}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Navbar />
          <main>
            <Hero videoActive={!introVisible} />
            {deferred && (
              <>
                <Stats />
                <BrandCarousel />
                <CinematicText />
                <ColombiaMap />
                <LogoShowcase />
                <Formats />
                <Audience />
                <Cases />
                <Comparison />
                <Blog />
                <Contact />
              </>
            )}
          </main>
          {deferred && <Footer />}
        </div>
      </div>
    </>
  )
}
