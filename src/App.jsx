import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import VideoIntro from './components/VideoIntro'
import Hero from './components/Hero'
import Stats from './components/Stats'
import BrandCarousel from './components/BrandCarousel'
import CinematicText from './components/CinematicText'
import ColombiaMap from './components/ColombiaMap'
import Formats from './components/Formats'
import Audience from './components/NewspaperAudience'
import Cases from './components/Cases'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'

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
        backgroundColor: '#1A1A1A',
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
      }}
    />
  )
}

/*
 * Dos capas de puntos:
 *  1. BaseDots  — puntos pequeños (1.5px) visibles en todo el fondo siempre
 *  2. SpotlightDots — capa enmascarada: tapa los puntos pequeños con #E9E9E9
 *     y dibuja puntos GRANDES (3.5px) solo dentro del círculo del cursor
 */
function BaseDots() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.18) 1.5px, transparent 1.5px)',
      backgroundSize: '20px 20px',
    }} />
  )
}

function SpotlightDots() {
  useEffect(() => {
    const root = document.documentElement
    const onMove = (e) => {
      root.style.setProperty('--mx', `${e.clientX}px`)
      root.style.setProperty('--my', `${e.clientY}px`)
    }
    const onLeave = () => {
      root.style.setProperty('--mx', '-999px')
      root.style.setProperty('--my', '-999px')
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
      /* Puntos grandes sobre fondo sólido: dentro del círculo cubre los pequeños y muestra los grandes */
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.22) 3.5px, transparent 3.5px)',
      backgroundSize: '20px 20px',
      backgroundColor: '#E9E9E9',
      maskImage: 'radial-gradient(circle 90px at var(--mx, -999px) var(--my, -999px), black 0%, black 55%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(circle 90px at var(--mx, -999px) var(--my, -999px), black 0%, black 55%, transparent 100%)',
    }} />
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
        <BaseDots />
        <SpotlightDots />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Navbar />
          <main>
            <Hero />
            <Stats />
            <BrandCarousel />
            <CinematicText />
            <ColombiaMap />
            <Formats />
            <Audience />
            <Cases />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
