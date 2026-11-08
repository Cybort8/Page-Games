export default function Terms() {
  return (
    <div className="container-page py-12 sm:py-16">
      <span className="sticker bg-sun">Legal</span>
      <h1 className="sign mt-4 text-5xl sm:text-6xl">Términos de servicio</h1>

      <div className="mt-8 max-w-[65ch] space-y-8 text-ink/75">
        <section>
          <h2 className="sign text-2xl text-ink">Uso del sitio</h2>
          <p className="mt-2">
            Al usar este sitio aceptas estos términos. El catálogo es informativo y la compra se
            concreta por WhatsApp con confirmación de disponibilidad.
          </p>
        </section>

        <section>
          <h2 className="sign text-2xl text-ink">Precios y pagos</h2>
          <p className="mt-2">
            Los precios se muestran en pesos colombianos (COP) y pueden cambiar sin previo aviso. El
            valor válido es el que se confirma en la conversación de compra.
          </p>
        </section>

        <section>
          <h2 className="sign text-2xl text-ink">Entregas</h2>
          <p className="mt-2">
            La entrega es digital y se coordina por WhatsApp una vez confirmado el pago. Los tiempos
            dependen del título y del medio de pago.
          </p>
        </section>

        <section>
          <h2 className="sign text-2xl text-ink">Contacto</h2>
          <p className="mt-2">
            Para dudas sobre estos términos escribe a{' '}
            <a href="mailto:soporte@digitalgames.com" className="text-cobalt underline">
              soporte@digitalgames.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
