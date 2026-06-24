import { useEffect, useRef, useState } from 'react'
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

const PAGE_BG_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'

/* Cursor personalizado — punto negro que sigue al mouse */
function CustomCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    let x = -100, y = -100
    let cx = -100, cy = -100
    let rafId

    const onMove = (e) => { x = e.clientX; y = e.clientY }
    const onLeave = () => { x = -100; y = -100 }

    const tick = () => {
      // Lerp casi inmediato — sin delay perceptible
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '14px',
        height: '14px',
        marginLeft: '-7px',
        marginTop: '-7px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
      }}
    />
  )
}

/*
 * Fondo interactivo de la página:
 *  1. Fondo 2.png — imagen fija que se mueve sutilmente con el mouse (efecto papel)
 *  2. Capa #E9E9E9 + puntos — gran círculo fijo en el centro revela la imagen;
 *     los puntos solo aparecen en los bordes de la pantalla (vignette estática)
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
      // Lerp lento → inercia de papel al deslizarse
      cpx += (px - cpx) * 0.038
      cpy += (py - cpy) * 0.038

      if (bgRef.current) {
        // ±11px máximo de desplazamiento
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
    <>
      {/* ① Fondo 2.png — se mueve con el mouse (efecto papel sutil) */}
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

    </>
  )
}

export default function App() {
  const [introVisible, setIntroVisible] = useState(
    () => !sessionStorage.getItem('bm_intro_seen')
  )

  return (
    <>
      {introVisible && (
        <VideoIntro onDismiss={() => {
          sessionStorage.setItem('bm_intro_seen', '1')
          setIntroVisible(false)
        }} />
      )}

      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <CustomCursor />
        <InteractiveBackground />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Navbar />
          <main>
            <Hero videoActive={!introVisible} />
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
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
