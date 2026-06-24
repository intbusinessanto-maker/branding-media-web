import { motion } from 'framer-motion'

const comparisons = [
  {
    vs: 'Universidades vs Centros Comerciales',
    ourTitle: 'Segmentación perfecta',
    ourText: 'Perfil universitario 100% verificado: edad, nivel socioeconómico, ciudad, área de estudio. Cero desperdicio en audiencia irrelevante.',
    theirTitle: 'Audiencia dispersa',
    theirText: 'Audiencia mixta: familias, adultos mayores, turistas, niños. El target joven adulto universitario representa solo el 25–30% del tráfico de un CC promedio.',
    color: '#00C4AD',
  },
  {
    vs: 'Universidades vs Vallas Urbanas',
    ourTitle: 'Dominio del espacio',
    ourText: 'Entorno de baja densidad publicitaria. Tu marca domina el espacio universitario. Sin competencia directa visible a metros de distancia.',
    theirTitle: 'Saturación total',
    theirText: 'Alta saturación. En una vía urbana promedio hay entre 3 y 5 vallas visibles desde un mismo punto. El 86% de los transeúntes desarrolló ceguera a vallas por sobreexposición.',
    color: '#E8118A',
  },
  {
    vs: 'Universidades vs Aeropuertos',
    ourTitle: 'Activación sin límites',
    ourText: 'Alta y flexible. El campus permite múltiples formatos de interacción sin restricciones de seguridad. Activaciones inmersivas, tecnológicas, culturales y sociales.',
    theirTitle: 'Activación restringida',
    theirText: 'Muy restrictiva. Los aeropuertos aplican protocolos de seguridad estrictos que limitan drásticamente las activaciones. Todo debe pasar por aprobación de Aerocivil y del operador.',
    color: '#8B3FA8',
  },
  {
    vs: 'Universidades vs Publicidad Aeroportuaria',
    ourTitle: 'Formación de hábitos',
    ourText: 'Máxima. El 78% de los hábitos de consumo que perduran toda la vida se forman entre los 18 y 25 años. El campus es el escenario exacto de esa ventana.',
    theirTitle: 'Hábitos ya consolidados',
    theirText: 'Baja. El viajero frecuente ya tiene hábitos consolidados. La publicidad aeroportuaria es de recordación y status, no de formación de preferencias nuevas.',
    color: '#00C4AD',
  },
  {
    vs: 'Universidades vs TV y Radio',
    ourTitle: 'Brand safety total',
    ourText: 'Total. El campus universitario es un entorno de comunicación 100% controlado: sin contenido adverso, sin comentarios, sin contexto editorial negativo.',
    theirTitle: 'Riesgo de contexto',
    theirText: 'Riesgo permanente. En TV y radio, el anuncio puede quedar entre noticias de escándalos, catástrofes o contenido viral negativo. La asociación de marca con el contexto es involuntaria e incontrolable.',
    color: '#E8118A',
  },
  {
    vs: 'Universidades vs ATL Tradicional',
    ourTitle: 'Fidelidad real',
    ourText: '85% de anunciantes renuevan con Branding Media. Los resultados generan retención natural, no descuentos de renovación forzada.',
    theirTitle: 'Alta rotación',
    theirText: 'Los anunciantes de ATL cambian frecuentemente de medio, de agencia y de formato buscando mayor efectividad. La fidelidad al medio es baja porque los resultados son difíciles de atribuir.',
    color: '#8B3FA8',
  },
]

export default function Comparison() {
  return (
    <section style={{ padding: 'clamp(60px,8vw,100px) clamp(1rem,4vw,2.5rem)', background: '#0D0D10', position: 'relative', overflow: 'hidden' }}>

      {/* Fondo decorativo */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 20% 0%, rgba(0,196,173,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(232,17,138,0.06) 0%, transparent 50%)' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 16 }}>
            Comparativa de medios
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', margin: 0, maxWidth: '860px', marginLeft: 'auto', marginRight: 'auto' }}>
            ¿Por qué <span style={{ color: '#E8118A' }}>CONVERTIMOS</span> en los espacios de pauta más importantes de todo Colombia?
          </h2>
        </motion.div>

        {/* Grid de comparativas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
          gap: 'clamp(16px, 2.5vw, 28px)',
        }}>
          {comparisons.map((c, i) => (
            <motion.div
              key={c.vs}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
              }}
            >
              {/* Header de la tarjeta */}
              <div style={{
                background: `${c.color}18`,
                borderBottom: `1px solid ${c.color}30`,
                padding: '14px 20px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 800, color: c.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {c.vs}
                </span>
              </div>

              {/* Dos paneles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

                {/* Panel izquierdo — nuestra ventaja */}
                <div style={{
                  padding: 'clamp(18px, 2.5vw, 28px)',
                  background: `${c.color}0D`,
                  borderRight: `1px solid rgba(255,255,255,0.06)`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Branding Media
                    </span>
                  </div>
                  <p style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 800, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>
                    {c.ourTitle}
                  </p>
                  <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}>
                    {c.ourText}
                  </p>
                </div>

                {/* Panel derecho — desventaja del otro */}
                <div style={{ padding: 'clamp(18px, 2.5vw, 28px)', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>❌</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Otros medios
                    </span>
                  </div>
                  <p style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: 10, lineHeight: 1.3 }}>
                    {c.theirTitle}
                  </p>
                  <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0 }}>
                    {c.theirText}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7 }}
          style={{ textAlign: 'center', marginTop: 'clamp(40px, 6vw, 64px)' }}>
          <a href="#contacto" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #E8118A, #8B3FA8)',
            color: '#fff', padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,44px)',
            borderRadius: '100px', fontSize: 'clamp(14px,2vw,16px)', fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 8px 32px rgba(232,17,138,0.35)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Activa tu campaña universitaria →
          </a>
        </motion.div>

      </div>
    </section>
  )
}
