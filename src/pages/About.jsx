import { Link } from 'react-router-dom'

const POINTS = [
  ['Catálogo curado', 'Elegimos títulos que valen la pena, no un listado infinito.'],
  ['Atención directa', 'Hablas con una persona por WhatsApp, sin bots ni formularios.'],
  ['Precios en COP', 'Todo claro en pesos colombianos, sin sorpresas al pagar.'],
]

export default function About() {
  return (
    <div className="container-page py-12 sm:py-16">
      <span className="sticker bg-sun">Quiénes somos</span>
      <h1 className="sign mt-4 text-5xl sm:text-6xl">Una tienda hecha por jugadores</h1>

      <div className="mt-6 max-w-[65ch] space-y-4 text-ink/75">
        <p>
          DigitalGames nació para acercar los videojuegos digitales a jugadores de Colombia. Armamos un
          catálogo corto y variado —acción, aventura, deportes, estrategia y más— y lo atendemos
          directamente por WhatsApp.
        </p>
        <p>
          No somos una plataforma gigante. Somos una tienda pequeña que responde rápido, confirma
          disponibilidad y entrega el juego apenas se concreta el pago.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {POINTS.map(([title, text]) => (
          <div key={title} className="border-2 border-ink bg-paper p-5 shadow-sticker">
            <h2 className="sign text-xl">{title}</h2>
            <p className="mt-2 text-sm text-ink/70">{text}</p>
          </div>
        ))}
      </div>

      <Link to="/Games" className="btn btn-primary mt-10">
        Ver el catálogo
      </Link>
    </div>
  )
}
