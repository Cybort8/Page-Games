import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Compañía',
    links: [{ label: 'Sobre nosotros', to: '/About' }],
  },
  {
    title: 'Apoyo',
    links: [
      { label: 'Centro de ayuda', to: '/Contact' },
      { label: 'Términos de servicio', to: '/Terms' },
      { label: 'Política de privacidad', to: '/Privacy' },
    ],
  },
  {
    title: 'Contacto',
    links: [{ label: 'Escríbenos', to: '/Contact' }],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="sign mb-4 text-lg text-sun">{column.title}</h2>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-paper/80 hover:text-paper hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="sign mb-4 text-lg text-sun">Síguenos</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.facebook.com/share/Vsro3jkyHZsnsRLx/"
                target="_blank"
                rel="noreferrer"
                className="text-paper/80 hover:text-paper hover:underline"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/digital__games___"
                target="_blank"
                rel="noreferrer"
                className="text-paper/80 hover:text-paper hover:underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://github.com/eldani13"
                target="_blank"
                rel="noreferrer"
                className="text-paper/80 hover:text-paper hover:underline"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/20">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 DigitalGames. Todos los derechos reservados.</p>
          <p>Hecho en Colombia. Pagos y entregas por WhatsApp.</p>
        </div>
      </div>
    </footer>
  )
}
