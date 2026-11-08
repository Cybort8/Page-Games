import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'

const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '+573011940150').replace(/\D/g, '')

const PROMISES = [
  { title: 'Entrega inmediata', text: 'Recibes tu juego apenas se confirma el pago.' },
  { title: 'Pago por WhatsApp', text: 'Coordinas todo con una persona real, sin formularios.' },
  { title: 'Catálogo curado', text: 'Acción, aventura, deportes, estrategia y más.' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listProducts()
      .then((products) => setFeatured(products.filter((product) => product.isFeatured)))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <section className="border-b-2 border-ink">
        <div
          className="h-4 border-b-2 border-ink"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #2338D6 0 28px, #F1EDE2 28px 56px)' }}
          aria-hidden="true"
        />
        <div className="container-page py-14 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="sticker -rotate-2 bg-sun">Tienda de videojuegos digitales</span>
            <h1 className="sign mt-6 text-[clamp(3rem,9vw,7rem)]">
              Los mejores juegos,
              <br />
              al mejor precio.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-ink/70 sm:text-lg">
              Elige tu título, paga por WhatsApp y recíbelo al instante. Acción, aventura, deportes y
              mucho más.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/Games" className="btn btn-primary">
                Ver catálogo
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink bg-bone">
        <div className="container-page grid divide-y-2 divide-ink sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          {PROMISES.map((promise) => (
            <div key={promise.title} className="px-2 py-6 sm:px-6">
              <h2 className="sign text-xl">{promise.title}</h2>
              <p className="mt-1 text-sm text-ink/70">{promise.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="sign text-4xl sm:text-5xl">Destacados</h2>
          {featured.length > 0 && (
            <span className="sticker bg-magenta text-white">{featured.length} en vitrina</span>
          )}
        </div>

        {error && (
          <div className="border-2 border-ink bg-paper p-6 shadow-sticker">
            <p className="sign text-2xl">No pudimos cargar el catálogo</p>
            <p className="mt-2 text-sm text-ink/70">
              Revisa tu conexión e inténtalo de nuevo en un momento.
            </p>
          </div>
        )}

        {!error && featured.length === 0 && (
          <div className="border-2 border-ink bg-bone p-10 text-center shadow-sticker">
            <p className="sign text-4xl">Muy pronto</p>
            <p className="mx-auto mt-3 max-w-md text-ink/70">
              Estamos preparando el catálogo. Vuelve pronto para ver los primeros juegos.
            </p>
            <Link to="/Contact" className="btn btn-sun mt-6">
              Avísame cuando abra
            </Link>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
