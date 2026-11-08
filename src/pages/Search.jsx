import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [])

  const results = query
    ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="sign text-4xl sm:text-5xl">
        Resultados para <span className="bg-sun px-1">{query || 'tu búsqueda'}</span>
      </h1>

      {error && (
        <div className="mt-8 border-2 border-ink bg-paper p-6 shadow-sticker">
          <p className="sign text-2xl">No pudimos buscar</p>
          <p className="mt-2 text-sm text-ink/70">
            Revisa tu conexión e inténtalo de nuevo en un momento.
          </p>
        </div>
      )}

      {!error && results.length === 0 && (
        <div className="mt-8 border-2 border-ink bg-bone p-10 text-center shadow-sticker">
          <p className="sign text-4xl">Sin coincidencias</p>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            No encontramos juegos para “{query}”. Prueba con otro nombre o revisa el catálogo completo.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
