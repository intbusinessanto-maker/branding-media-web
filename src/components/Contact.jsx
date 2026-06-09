import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', mensaje: '' })
  const [sent, setSent] = useState(false)
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setSent(true) }

  const input = {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
    color: '#1A1A1A', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  }

  return (
    <section id="contacto" style={{ padding: '100px 2rem', background: 'transparent', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'start' }}>
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Contacto</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '20px' }}>
              Activa tu campaña{' '}
              <span style={{ color: '#00C4AD' }}>universitaria</span>
            </h2>
            <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '36px' }}>En menos de 24 horas te presentamos una propuesta de medios personalizada.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '📍', label: 'Bogotá, Colombia', color: '#F07B00' },
                { icon: '📱', label: '+57 301 697 8741', color: '#00C4AD' },
                { icon: '✉️', label: 'admin@bmmedios.com', color: '#8B3FA8' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}12`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
                  <span style={{ fontSize: '14px', color: '#555' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {sent ? (
              <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(0,196,173,0.2)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '48px' }}>✓</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, background: 'linear-gradient(90deg, #00C4AD, #8B3FA8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>¡Mensaje enviado!</h3>
                <p style={{ color: '#888', fontSize: '14px' }}>Nos ponemos en contacto en menos de 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input style={input} name="nombre" placeholder="Nombre" value={form.nombre} onChange={handle} required />
                  <input style={input} name="empresa" placeholder="Empresa" value={form.empresa} onChange={handle} />
                </div>
                <input style={input} name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required />
                <textarea style={{ ...input, minHeight: '110px', resize: 'vertical' }} name="mensaje" placeholder="Cuéntanos sobre tu campaña..." value={form.mensaje} onChange={handle} />
                <button type="submit" style={{ background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)', color: '#fff', padding: '15px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,196,173,0.25)' }}>
                  Enviar propuesta →
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}



