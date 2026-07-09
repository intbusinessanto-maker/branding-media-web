import { useState, useEffect, useRef } from 'react'
import type React from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const FONDO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Fondo%202.png'
const WA_URL    = 'https://wa.me/573016978741?text=Hola%2C%20quiero%20información%20sobre%20publicidad%20en%20universidades'

/* Cursor personalizado — mismo que en home */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    let x = -100, y = -100, cx = -100, cy = -100, rafId: number
    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    const onLeave = () => { x = -100; y = -100 }
    const tick = () => {
      cx += (x - cx) * 0.85
      cy += (y - cy) * 0.85
      if (dotRef.current) dotRef.current.style.transform = `translate(${cx}px, ${cy}px)`
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
    <div ref={dotRef} style={{
      position: 'fixed', top: 0, left: 0, width: '18px', height: '18px',
      marginLeft: '-9px', marginTop: '-9px', borderRadius: '50%',
      backgroundColor: '#8B3FA8', border: '2.5px solid #fff',
      boxShadow: '0 0 0 1.5px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.3)',
      pointerEvents: 'none', zIndex: 99999, willChange: 'transform', cursor: 'none',
    }} />
  )
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  published_at?: string
  created_at?: string
  updated_at?: string
  cover_image_url?: string
  cover_image_alt?: string
  read_time_minutes?: number
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  content?: string
  author?: string
}

const LOGO_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png'

const categoryColors: Record<string, string> = {
  Estrategia: '#8B3FA8',
  DOOH: '#00C4AD',
  Tendencias: '#F07B00',
  OOH: '#3B82F6',
  'Marketing Universitario': '#10B981',
  'Casos de Éxito': '#F43F5E',
  'Publicidad OOH/DOOH': '#00C4AD',
  'Marketing y Publicidad': '#8B3FA8',
  'Publicidad Exterior': '#3B82F6',
}

function ArticleSchema({ post }: { post: Post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: (post.cover_image_url && !post.cover_image_url.startsWith('data:')) ? post.cover_image_url : '',
    author: { '@type': 'Organization', name: post.author || 'Bmmedios' },
    publisher: {
      '@type': 'Organization',
      name: 'Bmmedios',
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    keywords: (post.seo_keywords || []).join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.bmmedios.com/blog/${post.slug}` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function ArticlePage({ post, onBack }: { post: Post; onBack: () => void }) {
  const col = categoryColors[post.category] || '#00C4AD'
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''
  const hasRealImage = post.cover_image_url && !post.cover_image_url.startsWith('data:')

  useEffect(() => {
    document.title = (post.seo_title || post.title) + ' | Bmmedios'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', post.seo_description || post.excerpt || '')
    window.scrollTo(0, 0)
    return () => { document.title = 'Bmmedios — Publicidad en Universidades Colombia' }
  }, [post])

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    return parts.map((part: string, i: number) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i}>{part.slice(2, -2)}</strong>
      if (part.startsWith('*') && part.endsWith('*'))
        return <em key={i}>{part.slice(1, -1)}</em>
      return part
    })
  }

  const renderContent = (raw: string) => {
    const content = raw || ''
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      if (!line.trim()) { i++; continue }

      // H4 ####
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={i} style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', marginTop: '20px', marginBottom: '6px' }}>{renderInline(line.slice(5))}</h4>)
        i++; continue
      }
      // H3 ###
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1A1A1A', marginTop: '28px', marginBottom: '8px' }}>{renderInline(line.slice(4))}</h3>)
        i++; continue
      }
      // H2 ##
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A1A', marginTop: '40px', marginBottom: '12px', letterSpacing: '-0.02em' }}>{renderInline(line.slice(3))}</h2>)
        i++; continue
      }
      // H1 #
      if (line.startsWith('# ')) {
        elements.push(<h2 key={i} style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1A1A1A', marginTop: '40px', marginBottom: '14px', letterSpacing: '-0.02em' }}>{renderInline(line.slice(2))}</h2>)
        i++; continue
      }
      // Lista numerada: "1. texto" o "1. **texto**: ..."
      if (/^\d+\.\s/.test(line)) {
        const listItems = []
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(<li key={i} style={{ marginBottom: '8px' }}>{renderInline(lines[i].replace(/^\d+\.\s/, ''))}</li>)
          i++
        }
        elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '24px', marginBottom: '16px', lineHeight: 1.8 }}>{listItems}</ol>)
        continue
      }
      // Lista con guión o asterisco: "- texto" o "* texto"
      if (/^[-*]\s/.test(line)) {
        const listItems = []
        while (i < lines.length && /^[-*]\s/.test(lines[i])) {
          listItems.push(<li key={i} style={{ marginBottom: '6px' }}>{renderInline(lines[i].replace(/^[-*]\s/, ''))}</li>)
          i++
        }
        elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '24px', marginBottom: '16px', lineHeight: 1.8 }}>{listItems}</ul>)
        continue
      }
      // Párrafo normal
      elements.push(<p key={i} style={{ marginBottom: '16px' }}>{renderInline(line)}</p>)
      i++
    }
    return elements
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <ArticleSchema post={post} />

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '0 2rem', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <img src={LOGO_URL} alt="Branding Media" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
        </a>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>← Blog</button>
          <a href="/#contacto" style={{ background: '#8B3FA8', color: '#fff', padding: '9px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Contactar</a>
        </nav>
      </header>

      <section style={{ padding: '64px 2rem 80px', background: '#fff' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>
            {post.category}
          </span>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.2, marginTop: '16px', marginBottom: '16px' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#AAA', fontSize: '13px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <span>{post.author || 'Bmmedios'}</span>
            {dateStr && <><span>·</span><span>{dateStr}</span></>}
            {post.read_time_minutes && <><span>·</span><span>{post.read_time_minutes} min lectura</span></>}
          </div>

          {hasRealImage && (
            <img src={post.cover_image_url} alt={post.cover_image_alt || post.title}
              style={{ width: '100%', borderRadius: '14px', marginBottom: '40px', maxHeight: '420px', objectFit: 'cover' }} />
          )}

          {post.excerpt && (
            <p style={{ fontSize: '18px', color: '#444', lineHeight: 1.7, fontStyle: 'italic', borderLeft: `3px solid ${col}`, paddingLeft: '20px', marginBottom: '32px' }}>
              {post.excerpt}
            </p>
          )}

          <div style={{ fontSize: '16px', color: '#333', lineHeight: 1.8 }}>
            {renderContent(post.content ?? '')}
          </div>

          {(post.seo_keywords?.length ?? 0) > 0 && (
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {post.seo_keywords!.map((k: string, i: number) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', background: 'rgba(0,0,0,0.05)', color: '#666', border: '1px solid rgba(0,0,0,0.08)' }}>
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '48px', padding: '28px', borderRadius: '16px', background: 'linear-gradient(135deg, #F8F0FF, #F0FFFE)', border: '1px solid rgba(139,63,168,0.12)', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>¿Quieres llegar a 9.000.000 universitarios en Colombia?</p>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Bmmedios es la única agencia especializada en publicidad OOH y DOOH en universidades.</p>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#25D366', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              Hablar con un experto →
            </a>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '24px 2rem', textAlign: 'center' }}>
        <a href="/blog" style={{ color: '#8B3FA8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>← Volver al blog</a>
        <span style={{ margin: '0 16px', color: '#DDD' }}>|</span>
        <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Volver al sitio principal</a>
      </footer>
    </div>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Post | null>(null)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, published_at, cover_image_url, cover_image_alt, read_time_minutes, seo_title, seo_description, seo_keywords, content, author, updated_at, created_at')
      .eq('status', 'publicado')
      .order('published_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { setPosts((data as Post[]) || []); setLoading(false) })
  }, [])

  if (selected) return <ArticlePage post={selected} onBack={() => setSelected(null)} />

  const skeletons = [1, 2, 3]

  return (
    <div style={{
      minHeight: '100vh',
      background: `#fff url(${FONDO_URL}) center/cover fixed`,
    }}>
      <CustomCursor />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog Bmmedios',
        description: 'Perspectivas sobre publicidad OOH y DOOH en campus universitarios de Colombia y Latinoamérica',
        url: 'https://www.bmmedios.com/blog',
        publisher: { '@type': 'Organization', name: 'Bmmedios' },
      }) }} />

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '0 2rem', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <img src={LOGO_URL} alt="Branding Media" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
        </a>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Inicio</a>
          <a href="/#contacto" style={{ background: '#8B3FA8', color: '#fff', padding: '9px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>Contactar</a>
        </nav>
      </header>

      <section style={{
        background: 'linear-gradient(135deg, rgba(248,240,255,0.88) 0%, rgba(240,255,254,0.88) 100%)',
        padding: 'clamp(60px,10vw,100px) 2rem clamp(40px,8vw,80px)',
        textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B3FA8', display: 'block', marginBottom: '14px' }}>Blog</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#1A1A1A', lineHeight: 1.05, marginBottom: '16px' }}>
            Perspectivas sobre{' '}
            <span style={{ color: '#8B3FA8' }}>medios universitarios</span>
          </h1>
          <p style={{ color: '#666', fontSize: 'clamp(14px,2vw,18px)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            Insights, datos y estrategias para marcas que quieren conectar con la generación universitaria colombiana.
          </p>
        </motion.div>
      </section>

      <section style={{ padding: 'clamp(40px,6vw,80px) 2rem clamp(60px,8vw,100px)', maxWidth: '1100px', margin: '0 auto' }}>
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {skeletons.map(i => (
              <div key={i} style={{ height: '260px', borderRadius: '18px', background: '#F3F3F3', animation: 'bm-pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '18px', color: '#999', marginBottom: '8px' }}>Próximamente</p>
            <p style={{ fontSize: '14px', color: '#BBB' }}>Estamos preparando contenido de valor sobre publicidad universitaria en Colombia.</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {posts.map((p, i) => {
              const col = categoryColors[p.category] || '#00C4AD'
              const hasRealImage = p.cover_image_url && !p.cover_image_url.startsWith('data:')
              const dateStr = p.published_at
                ? new Date(p.published_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
                : ''
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }}
                  onClick={() => setSelected(p)}
                  style={{
                    padding: '0', borderRadius: '18px', background: '#FAFAFA',
                    border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column', cursor: 'pointer',
                    overflow: 'hidden', transition: 'box-shadow 0.25s, transform 0.25s',
                  }}
                >
                  {hasRealImage ? (
                    <img src={p.cover_image_url} alt={p.cover_image_alt || p.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '8px', background: `linear-gradient(90deg, ${col}, ${col}88)` }} />
                  )}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '4px 10px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>{p.category}</span>
                      <span style={{ fontSize: '11px', color: '#AAA' }}>{p.read_time_minutes} min</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '8px' }}>{p.title}</h2>
                      <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>{p.excerpt}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '12px', color: '#AAA' }}>{dateStr}</span>
                      <span style={{ fontSize: '12px', color: col, fontWeight: 700 }}>Leer artículo →</span>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </section>

      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '32px 2rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#8B3FA8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>← Volver al sitio principal</a>
      </footer>

      <style>{`
        @keyframes bm-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
