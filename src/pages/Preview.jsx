import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'

const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '+573011940150').replace(/\D/g, '')

export default function Preview() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const { add } = useCart()

  useEffect(() => {
    api
      .getProduct(productId)
      .then(setProduct)
      .catch((err) => setError(err.message))
  }, [productId])

  const buyOnWhatsApp = () => {
    if (!product) return
    const message =
      `Hola, me interesa el juego "${product.name}".\n` +
      `Precio: ${Number(product.price).toLocaleString('es-CO')} COP\n` +
      `Categoría: ${product.category}\n\n` +
      '¿Me confirmas disponibilidad y forma de pago?'
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const share = async () => {
    if (!product) return
    const data = {
      title: product.name,
      text: `Mira este juego: ${product.name}`,
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        // el usuario canceló el diálogo
      }
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`, '_blank')
    }
  }

  if (error) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg border-2 border-ink bg-paper p-8 text-center shadow-sticker">
          <p className="sign text-3xl">No encontramos ese juego</p>
          <p className="mt-2 text-sm text-ink/70">{error}</p>
          <Link to="/Games" className="btn btn-primary mt-6">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return <p className="container-page py-16 text-ink/60">Cargando...</p>
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Link to="/Games" className="text-sm font-semibold text-ink/60 hover:text-cobalt">
        ← Volver al catálogo
      </Link>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="relative border-2 border-ink bg-bone shadow-sticker">
          <div className="aspect-[4/3] overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink/40">Sin imagen</div>
            )}
          </div>
          {product.isFeatured && (
            <span className="sticker absolute left-3 top-3 -rotate-2 bg-magenta text-white">Destacado</span>
          )}
        </div>

        <div>
          <span className="sticker bg-sun">{product.category}</span>
          <h1 className="sign mt-4 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 max-w-[60ch] text-ink/70">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            {product.oldPrice ? (
              <p className="text-lg text-ink/40 line-through">
                {Number(product.oldPrice).toLocaleString('es-CO')} COP
              </p>
            ) : null}
            <p className="font-display text-4xl leading-none">
              ${Number(product.price).toLocaleString('es-CO')}
              <span className="ml-1 font-sans text-sm font-semibold text-ink/60">COP</span>
            </p>
          </div>

          {product.features?.length ? (
            <ul className="mt-6 divide-y-2 divide-ink border-2 border-ink bg-paper">
              {product.features.map((feature) => (
                <li key={feature} className="px-4 py-2 text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => add(product)} className="btn btn-ghost">
              Agregar al carrito
            </button>
            <button onClick={buyOnWhatsApp} className="btn btn-primary">
              Comprar por WhatsApp
            </button>
            <button onClick={share} className="btn btn-sun">
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
