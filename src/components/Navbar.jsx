import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartModal from './CartModal'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/Games', label: 'Juegos' },
  { to: '/About', label: 'Nosotros' },
  { to: '/Contact', label: 'Contacto' },
]

const TICKER = ['Juegos originales', 'Pago por WhatsApp', 'Entrega inmediata', 'Atención personalizada']

function TickerGroup() {
  return (
    <span className="flex shrink-0 items-center gap-6 pr-6">
      {[...TICKER, ...TICKER].map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-6 whitespace-nowrap">
          {item}
          <span aria-hidden="true">✶</span>
        </span>
      ))}
    </span>
  )
}

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const navigate = useNavigate()
  const { count } = useCart()

  const search = (event) => {
    event.preventDefault()
    if (query.trim()) navigate(`/Search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden border-b-2 border-ink bg-cobalt py-2 text-xs font-semibold uppercase tracking-widest text-white">
        <div className="marquee-track">
          <TickerGroup />
          <TickerGroup />
        </div>
      </div>

      <div className="border-b-2 border-ink bg-paper">
        <div className="container-page flex items-center gap-3 py-3 sm:gap-4">
          <Link to="/" className="sign shrink-0 text-2xl sm:text-3xl">
            DigitalGames
          </Link>

          <nav className="ml-3 hidden items-center gap-5 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-semibold decoration-magenta decoration-2 underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={search} className="ml-auto hidden sm:block">
            <label htmlFor="nav-search" className="sr-only">
              Buscar juegos
            </label>
            <input
              id="nav-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar un juego"
              className="field w-44 lg:w-52"
            />
          </form>

          <button
            onClick={() => setCartOpen(true)}
            className="relative ml-auto border-2 border-ink bg-sun px-3 py-2 shadow-sticker transition-transform hover:-translate-y-0.5 sm:ml-0"
          >
            <span aria-hidden="true">🛒</span>
            <span className="sr-only">Abrir carrito</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center border-2 border-ink bg-magenta px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            className="border-2 border-ink bg-paper px-3 py-2 text-lg leading-none md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <nav className="container-page flex flex-col gap-1 border-t-2 border-ink py-3 md:hidden">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="border-b border-ink/10 py-2 text-sm font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
