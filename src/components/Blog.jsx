import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const categoryColors = { Estrategia: '#8B3FA8', DOOH: '#00C4AD', Tendencias: '#F07B00', OOH: '#3B82F6', 'Marketing Universitario': '#10B981', 'Casos de Éxito': '#F43F5E' }

function ArticleSchema({ post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.cover_image_url || '',
    author: { '@type': 'Organization', name: post.author || 'Bmmedios' },
    publisher: {
      '@type': 'Organization',
      name: 'Bmmedios',
      logo: { '@type': 'ImageObject', url: 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/Logo-Branding-Media.png' },
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    keywords: (post.seo_keywords || []).join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.bmmedios.com/blog/${post.slug}` },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function ArticlePage({ post, onBack }) {
  const col = categoryColors[post.category] || '#00C4AD'
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''

  useEffect(() => {
    document.title = (post.seo_title || post.title) + ' | Bmmedios'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', post.seo_description || post.excerpt || '')
    window.scrollTo(0, 0)
    return () => { document.title = 'Bmmedios — Publicidad en Universidades Colombia' }
  }, [post])

  const paragraphs = (post.content || '').split('\n').filter(l => l.trim())

  return (
    <section style={{ padding: '80px 2rem', background: '#fff' }}>
      <ArticleSchema post={post} />
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '13px', fontWeight: 600, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
          ← Volver al blog
        </button>

        <span style={{ fontSize: '11px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>
          {post.category}
        </span>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.2, marginTop: '16px', marginBottom: '16px' }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#AAA', fontSize: '13px', marginBottom: '32px' }}>
          <span>{post.author || 'Bmmedios'}</span>
          <span>·</span>
          <span>{dateStr}</span>
          {post.read_time_minutes && <><span>·</span><span>{post.read_time_minutes} min lectura</span></>}
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt || post.title}
            style={{ width: '100%', borderRadius: '14px', marginBottom: '40px', maxHeight: '420px', objectFit: 'cover' }}
          />
        )}

        {post.excerpt && (
          <p style={{ fontSize: '18px', color: '#444', lineHeight: 1.7, fontStyle: 'italic', borderLeft: `3px solid ${col}`, paddingLeft: '20px', marginBottom: '32px' }}>
            {post.excerpt}
          </p>
        )}

        <div style={{ fontSize: '16px', color: '#333', lineHeight: 1.8 }}>
          {paragraphs.map((p, i) => {
            if (p.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A1A', marginTop: '36px', marginBottom: '12px', letterSpacing: '-0.02em' }}>{p.replace('## ', '')}</h2>
            if (p.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A1A1A', marginTop: '24px', marginBottom: '8px' }}>{p.replace('### ', '')}</h3>
            return <p key={i} style={{ marginBottom: '16px' }}>{p}</p>
          })}
        </div>

        {post.seo_keywords?.length > 0 && (
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {post.seo_keywords.map((k, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '12px', background: 'rgba(0,0,0,0.05)', color: '#666', border: '1px solid rgba(0,0,0,0.08)' }}>
                  #{k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, published_at, cover_image_url, cover_image_alt, read_time_minutes, seo_title, seo_description, seo_keywords')
      .eq('status', 'publicado')
      .order('published_at', { ascending: false })
      .limit(6)
      .then(({ data }) => { setPosts(data || []); setLoading(false) })
  }, [])

  if (selected) return <ArticlePage post={selected} onBack={() => setSelected(null)} />

  const displayPosts = loading
    ? [
        { id: 'sk1', skeleton: true },
        { id: 'sk2', skeleton: true },
        { id: 'sk3', skeleton: true },
      ]
    : posts.length > 0 ? posts : [
        { id: 'ph1', placeholder: true, category: 'Estrategia', title: '¿Tu marca es protagonista o solo parte del paisaje?', excerpt: 'Estamos pagando fortunas por ser ignorados. El fin de la publicidad invisible en entornos universitarios.', read_time_minutes: 5 },
        { id: 'ph2', placeholder: true, category: 'DOOH', title: 'Programmatic DOOH en universidades: la próxima frontera', excerpt: 'Cómo la compra programática de espacios digitales en campus está cambiando la planificación de medios.', read_time_minutes: 7 },
        { id: 'ph3', placeholder: true, category: 'Tendencias', title: 'El universitario colombiano: el consumidor más valioso de la próxima década', excerpt: 'Datos, comportamientos y por qué las marcas más inteligentes ya están invirtiendo en este segmento.', read_time_minutes: 6 },
      ]

  return (
    <section id="blog" style={{ padding: '100px 2rem', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      {/* Schema de blog */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog Bmmedios',
        description: 'Perspectivas sobre publicidad OOH y DOOH en campus universitarios de Colombia y Latinoamérica',
        url: 'https://www.bmmedios.com/blog',
        publisher: { '@type': 'Organization', name: 'Bmmedios' },
      }) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Blog</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1 }}>
              Perspectivas sobre{' '}
              <span style={{ color: '#8B3FA8' }}>medios universitarios</span>
            </h2>
          </div>
          {posts.length > 3 && (
            <button style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#555', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: 'none', cursor: 'pointer' }}>
              Ver todos →
            </button>
          )}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {displayPosts.map((p, i) => {
            if (p.skeleton) return (
              <div key={p.id} style={{ padding: '28px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)', minHeight: '200px', animation: 'pulse 1.5s infinite' }} />
            )
            const col = categoryColors[p.category] || '#00C4AD'
            const dateStr = p.published_at
              ? new Date(p.published_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Próximamente'
            return (
              <motion.article key={p.id}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(0,0,0,0.09)', transition: { duration: 0.2 } }}
                onClick={() => !p.placeholder && setSelected(p)}
                style={{
                  padding: '28px', borderRadius: '14px', background: '#FAFAFA',
                  border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                  cursor: p.placeholder ? 'default' : 'pointer',
                }}>
                {p.cover_image_url && (
                  <img src={p.cover_image_url} alt={p.cover_image_alt || p.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: col, border: `1px solid ${col}30`, padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.08em', textTransform: 'uppercase', background: `${col}0A` }}>
                    {p.category}
                  </span>
                  <span style={{ fontSize: '11px', color: '#AAA' }}>{p.read_time_minutes} min</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '8px' }}>{p.title}</h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>{p.excerpt}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <span style={{ fontSize: '12px', color: '#AAA' }}>{dateStr}</span>
                  {!p.placeholder && <span style={{ fontSize: '12px', color: col, fontWeight: 600 }}>Leer →</span>}
                  {p.placeholder && <span style={{ fontSize: '12px', color: '#CCC' }}>Próximamente</span>}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
