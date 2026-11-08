import { useEffect, useState } from 'react'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['Todos', 'Acción', 'Lucha', 'Aventura', 'Arcade', 'Deportes', 'Estrategia', 'Simulación']

export default function Games() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('Todos')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [])

  const visible = category === 'Todos' ? products : products.filter((p) => p.category === category)

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="sign text-5xl sm:text-6xl">Catálogo</h1>
        {!error && products.length > 0 && (
          <span className="sticker bg-sun">
            {products.length} {products.length === 1 ? 'juego' : 'juegos'}
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={`whitespace-nowrap border-2 border-ink px-4 py-2 text-sm font-semibold transition-colors ${
              category === item ? 'bg-cobalt text-white' : 'bg-paper text-ink hover:bg-bone'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-8 border-2 border-ink bg-paper p-6 shadow-sticker">
          <p className="sign text-2xl">No pudimos cargar el catálogo</p>
          <p className="mt-2 text-sm text-ink/70">
            Revisa tu conexión e inténtalo de nuevo en un momento.
          </p>
        </div>
      )}

      {!error && visible.length === 0 && (
        <div className="mt-8 border-2 border-ink bg-bone p-10 text-center shadow-sticker">
          <p className="sign text-4xl">Sin juegos por ahora</p>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            No hay títulos en esta categoría. Prueba con otra o vuelve pronto.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
