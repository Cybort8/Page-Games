import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { add } = useCart()

  return (
    <article className="cartridge group flex flex-col">
      <div className="flex">
        <div className="flex w-8 shrink-0 items-center justify-center border-r-2 border-ink bg-cobalt">
          <span className="spine text-[10px] font-bold uppercase tracking-widest text-white">
            {product.category}
          </span>
        </div>

        <Link to={`/Preview/${product._id}`} className="relative block aspect-[4/3] flex-1 overflow-hidden bg-bone">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/40">Sin imagen</div>
          )}

          {product.isFeatured && (
            <span className="sticker absolute left-2 top-2 -rotate-2 bg-magenta text-white">Destacado</span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t-2 border-ink p-4">
        <Link to={`/Preview/${product._id}`} className="sign text-xl leading-tight hover:text-cobalt">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-ink/70">{product.description}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            {product.oldPrice ? (
              <p className="text-xs text-ink/40 line-through">
                {Number(product.oldPrice).toLocaleString('es-CO')} COP
              </p>
            ) : null}
            <p className="font-display text-2xl leading-none">
              ${Number(product.price ?? 0).toLocaleString('es-CO')}
              <span className="ml-1 text-xs font-sans font-semibold text-ink/60">COP</span>
            </p>
          </div>
          <button onClick={() => add(product)} className="btn btn-primary px-4 py-2">
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
