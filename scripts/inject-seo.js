/**
 * Corre antes de vite build. Lee seo_config desde Supabase e inyecta
 * los valores en index.html, reemplazando los placeholders marcados.
 * Si Supabase no responde, el build continúa con los valores que ya
 * están en el HTML (fallback seguro).
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dir, '..')
const HTML_PATH = resolve(ROOT, 'index.html')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_KEY  = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

async function fetchSeoConfig() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.warn('[inject-seo] Sin credenciales Supabase — build continúa con valores actuales del HTML.')
    return null
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/seo_config?id=eq.1&select=title,description,keywords,canonical,og_image,faqs`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    )
    const data = await res.json()
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch (err) {
    console.warn('[inject-seo] Error consultando Supabase:', err.message)
    return null
  }
}

function buildFaqSchema(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }, null, 2)
}

function escape(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function main() {
  const cfg = await fetchSeoConfig()
  if (!cfg) {
    console.log('[inject-seo] Sin configuración — index.html sin cambios.')
    return
  }

  let html = readFileSync(HTML_PATH, 'utf-8')
  const original = html

  const title       = escape(cfg.title)
  const description = escape(cfg.description)
  const canonical   = escape(cfg.canonical)
  const ogImage     = escape(cfg.og_image)

  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)

  // Meta description
  html = html.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${description}$2`
  )

  // Meta keywords
  if (cfg.keywords) {
    html = html.replace(
      /(<meta\s+name="keywords"\s+content=")[^"]*(")/,
      `$1${escape(cfg.keywords)}$2`
    )
  }

  // Canonical
  html = html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${canonical}$2`
  )

  // OG title
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  )
  // OG description
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${description}$2`
  )
  // OG URL
  html = html.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonical}$2`
  )
  // OG image
  html = html.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
    `$1${ogImage}$2`
  )

  // Twitter title
  html = html.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${title}$2`
  )
  // Twitter description
  html = html.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${description}$2`
  )
  // Twitter image
  html = html.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
    `$1${ogImage}$2`
  )

  // FAQPage schema — reemplaza el bloque AEO existente
  const faqSchema = buildFaqSchema(cfg.faqs)
  if (faqSchema) {
    html = html.replace(
      /<!-- AEO:.*?-->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<!-- AEO: Preguntas frecuentes para Google AI Overview y LLMs -->\n    <script type="application/ld+json">\n    ${faqSchema}\n    </script>`
    )
  }

  if (html !== original) {
    writeFileSync(HTML_PATH, html, 'utf-8')
    console.log('[inject-seo] index.html actualizado con valores de Supabase.')
    console.log(`  title:       ${cfg.title}`)
    console.log(`  description: ${cfg.description.slice(0, 80)}…`)
    console.log(`  faqs:        ${(cfg.faqs || []).length} preguntas`)
  } else {
    console.log('[inject-seo] Sin diferencias — index.html no modificado.')
  }
}

main()
