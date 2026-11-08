export default function Privacy() {
  return (
    <div className="container-page py-12 sm:py-16">
      <span className="sticker bg-sun">Legal</span>
      <h1 className="sign mt-4 text-5xl sm:text-6xl">Política de privacidad</h1>

      <div className="mt-8 max-w-[65ch] space-y-8 text-ink/75">
        <section>
          <h2 className="sign text-2xl text-ink">Qué datos recopilamos</h2>
          <p className="mt-2">
            Solo los datos que nos das al contactarnos: nombre, correo y mensaje. Los usamos para
            responder a tu solicitud.
          </p>
        </section>

        <section>
          <h2 className="sign text-2xl text-ink">Qué guarda tu navegador</h2>
          <p className="mt-2">
            El carrito se guarda localmente en tu navegador. Puedes vaciarlo en cualquier momento desde
            el mismo carrito.
          </p>
        </section>

        <section>
          <h2 className="sign text-2xl text-ink">Con quién compartimos</h2>
          <p className="mt-2">
            No vendemos tus datos. Usamos los servicios necesarios para operar el sitio, como el envío
            del formulario de contacto y la mensajería de WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="sign text-2xl text-ink">Tus derechos</h2>
          <p className="mt-2">
            Puedes pedir acceso, corrección o eliminación de tus datos escribiendo a{' '}
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
