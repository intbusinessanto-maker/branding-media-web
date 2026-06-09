import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import BrandCarousel from './components/BrandCarousel'
import ColombiaMap from './components/ColombiaMap'
import Formats from './components/Formats'
import Audience from './components/Audience'
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
      // Lerp suave para que el punto siga con un mínimo de inercia
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
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

/* Spotlight — dots amplificados solo cerca del cursor, detrás del contenido */
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
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.22) 2.2px, transparent 2.2px)',
      backgroundSize: '20px 20px',
      maskImage: 'radial-gradient(circle 85px at var(--mx, -999px) var(--my, -999px), black 0%, black 50%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(circle 85px at var(--mx, -999px) var(--my, -999px), black 0%, black 50%, transparent 100%)',
    }} />
  )
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CustomCursor />
      <SpotlightDots />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <BrandCarousel />
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
  )
}
