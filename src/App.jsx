import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import ColombiaMap from './components/ColombiaMap'
import Formats from './components/Formats'
import Audience from './components/Audience'
import Cases from './components/Cases'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
export default function App() {
  return (
    <div style={{ backgroundColor: '#0A0A0A', color: '#fff', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ColombiaMap />
        <Formats />
        <Audience />
        <Cases />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
