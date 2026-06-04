import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const submit = e => { e.preventDefault(); setSent(true) }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #1E1E1E',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  }

  return (
    <section
      id="contacto"
      style={{ padding: '100px 2rem', backgroundColor: '#0D0D0D', borderTop: '1px solid #1E1E1E' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#00C4AD',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'block', marginBottom: '16px',
            }}>
              Contacto
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px',
            }}>
              Activa tu campaña<br />
              <span style={{
                background: 'linear-gradient(90deg, #00C4AD, #8B3FA8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>universitaria</span>
            </h2>
            <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }}>
              Cuéntanos sobre tu marca y objetivos.
              En menos de 24 horas te presentamos una propuesta
              de medios personalizada.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: '📍', label: 'Bogotá, Colombia', color: '#F07B00' },
                { icon: '📱', label: '+57 301 697 8741', color: '#00C4AD' },
                { icon: '✉️', label: 'admin@bmmedios.com', color: '#8B3FA8' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    backgroundColor: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '14px', color: '#888' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {sent ? (
              <div style={{
                padding: '48px', borderRadius: '16px',
                border: '1px solid rgba(0,196,173,0.3)',
                background: 'linear-gradient(135deg, rgba(0,196,173,0.05), rgba(139,63,168,0.05))',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
              }}>
                <div style={{ fontSize: '48px' }}>✓</div>
                <h3 style={{
                  fontSize: '20px', fontWeight: 700,
                  background: 'linear-gradient(90deg, #00C4AD, #8B3FA8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>¡Mensaje enviado!</h3>
                <p style={{ color: '#555', fontSize: '14px' }}>Nos ponemos en contacto en menos de 24 horas.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input style={inputStyle} name="nombre" placeholder="Nombre" value={form.nombre} onChange={handle} required />
                  <input style={inputStyle} name="empresa" placeholder="Empresa" value={form.empresa} onChange={handle} />
                </div>
                <input style={inputStyle} name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required />
                <textarea
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                  name="mensaje" placeholder="Cuéntanos sobre tu campaña..."
                  value={form.mensaje} onChange={handle}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #8B3FA8, #00C4AD)',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 0 30px rgba(0,196,173,0.2)',
                  }}
                >
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
