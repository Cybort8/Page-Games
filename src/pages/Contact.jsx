import { useState } from 'react'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_21eetlp'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_p28qlxg'
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'F-mGqCco39_NJibSX'
const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '+573011940150').replace(/\D/g, '')

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setStatus('Enviando...')
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: USER_ID,
          template_params: form,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setForm({ name: '', email: '', message: '' })
      setStatus('Mensaje enviado. Te respondemos pronto.')
    } catch (err) {
      setStatus(`No pudimos enviar el mensaje: ${err.message}`)
    }
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <span className="sticker bg-sun">Contacto</span>
          <h1 className="sign mt-4 text-5xl sm:text-6xl">Hablemos</h1>
          <p className="mt-4 max-w-[55ch] text-ink/75">
            ¿Dudas sobre un juego, un pedido o la forma de pago? Escríbenos y te respondemos lo antes
            posible.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-semibold">Correo</dt>
              <dd>
                <a href="mailto:soporte@digitalgames.com" className="text-cobalt underline">
                  soporte@digitalgames.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">WhatsApp</dt>
              <dd>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cobalt underline"
                >
                  Escribir por WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Horario</dt>
              <dd className="text-ink/70">Lunes a sábado, 9:00 a 19:00 (hora Colombia).</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={submit} className="border-2 border-ink bg-paper p-6 shadow-sticker">
          <h2 className="sign text-2xl">Envíanos un mensaje</h2>

          <div className="mt-5 space-y-4">
            <label className="flex flex-col gap-1 text-sm font-semibold">
              Nombre
              <input value={form.name} onChange={update('name')} required className="field" />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Correo
              <input type="email" value={form.email} onChange={update('email')} required className="field" />
            </label>

            <label className="flex flex-col gap-1 text-sm font-semibold">
              Mensaje
              <textarea value={form.message} onChange={update('message')} required rows={5} className="field" />
            </label>
          </div>

          <button type="submit" className="btn btn-primary mt-5 w-full">
            Enviar mensaje
          </button>

          {status && (
            <p className="mt-3 text-sm text-ink/70" role="status">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
