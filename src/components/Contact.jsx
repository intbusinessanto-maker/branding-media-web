import { motion } from 'framer-motion'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const FIGURA_URL = 'https://hmopsdbpyihfnxwfebbd.supabase.co/storage/v1/object/public/Imagenes%20para%20la%20web/figura%201.png'

const INFO_ITEMS = [
  { icon: '📍', label: 'Bogotá, Colombia',    color: '#E8118A' },
  { icon: '📱', label: '+57 301 697 8741',    color: '#00C4AD' },
  { icon: '✉️', label: 'admin@bmmedios.com',  color: '#8B3FA8' },
]

export default function Contact() {
  const [form, setForm]       = useState({ nombre: '', empresa: '', email: '', mensaje: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    const { error: dbErr } = await supabase.from('contact_submissions').insert([{
      nombre:  form.nombre.trim(),
      empresa: form.empresa.trim(),
      email:   form.email.trim(),
      mensaje: form.mensaje.trim(),
    }])
    setSending(false)
    if (dbErr) { setError('Hubo un error al enviar. Intenta de nuevo.'); return }
    setSent(true)
  }

  const input = {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.12)', background: '#fff',
    color: '#1A1A1A', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  }

  return (
    <section id="contacto" style={{ padding: 'clamp(60px,8vw,100px) 1.5rem', background: 'transparent', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <style>{`
        /* Desktop: 3 columnas — figura | info | formulario */
        .contact-outer { display: grid; grid-template-columns: clamp(120px,12vw,180px) 1.3fr 1.1fr; gap: clamp(32px, 4vw, 60px); align-items: stretch; }
        /* Móvil: 1 columna, figura inline con los items */
        @media (max-width: 768px) {
          .contact-outer { grid-template-columns: 1fr; gap: 32px; }
          .contact-figura-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .contact-figura-mobile { display: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="contact-outer">

          {/* ── Col 1: Figura (solo desktop) ── */}
          <motion.div className="contact-figura-desktop"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ display: 'flex', alignItems: 'flex-end' }}>
            <img src={FIGURA_URL} alt="" loading="lazy"
              style={{ width: '100%', height: '100%', maxHeight: '100%', objectFit: 'contain', objectPosition: 'bottom center', display: 'block' }} />
          </motion.div>

          {/* ── Col 2: Título + info ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '12px' }}>Contacto</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.1, marginBottom: '20px' }}>
              Activa tu campaña{' '}
              <span style={{ color: '#00C4AD' }}>universitaria</span>
            </h2>
            <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>En menos de 24 horas te presentamos una propuesta de medios personalizada.</p>

            {/* Items de contacto — en móvil: fila con figura a la derecha */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {INFO_ITEMS.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}12`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{item.icon}</div>
                    <span style={{ fontSize: '14px', color: '#555' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Figura móvil — a la derecha de los items */}
              <div className="contact-figura-mobile" style={{ flexShrink: 0, width: 'clamp(90px, 28vw, 140px)' }}>
                <img src={FIGURA_URL} alt="" loading="lazy"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            </div>
          </motion.div>

          {/* ── Col 3: Formulario ── */}
          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {sent ? (
              <div style={{ padding: '48px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(0,196,173,0.2)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '48px' }}>✓</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#00C4AD' }}>¡Mensaje enviado!</h3>
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
                {error && (
                  <p style={{ color: '#E8118A', fontSize: '13px', margin: 0 }}>{error}</p>
                )}
                <button type="submit" disabled={sending}
                  style={{ background: sending ? '#b97fd4' : '#8B3FA8', color: '#fff', padding: '15px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: sending ? 'default' : 'pointer', boxShadow: '0 8px 24px rgba(139,63,168,0.25)', transition: 'background 0.2s' }}>
                  {sending ? 'Enviando…' : 'Enviar propuesta →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}



