import { useCart } from '../context/CartContext'

const WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER || '+573011940150').replace(/\D/g, '')

export default function CartModal({ open, onClose }) {
  const { items, add, decrease, remove, clear, total, count } = useCart()

  if (!open) return null

  const checkout = () => {
    if (!items.length) return

    const lines = items
      .map(
        (product) =>
          `🛒 *${product.name}*\n` +
          `Cantidad: ${product.quantity}\n` +
          `Precio unitario: ${Number(product.price).toLocaleString('es-CO')} COP\n` +
          `Subtotal: ${(product.price * product.quantity).toLocaleString('es-CO')} COP`,
      )
      .join('\n\n')

    const message =
      `Hola, quiero comprar estos juegos:\n\n${lines}\n\n` +
      `Total: ${total.toLocaleString('es-CO')} COP\n\n` +
      '¿Me confirmas disponibilidad y forma de pago? Gracias.'

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="flex max-h-full w-full max-w-lg flex-col border-2 border-ink bg-paper shadow-lift">
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <h2 className="sign text-2xl">
            Tu pedido {count > 0 && <span className="text-magenta">({count})</span>}
          </h2>
          <button
            onClick={onClose}
            className="border-2 border-ink bg-paper px-2 text-xl leading-none hover:bg-bone"
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <p className="sign text-2xl text-ink/70">Todavía no hay nada aquí</p>
              <p className="mt-2 text-sm text-ink/60">Agrega un juego y vuelve para cerrar el pedido.</p>
            </div>
          ) : (
            items.map((product) => (
              <div key={product._id} className="flex items-center gap-3 border-b border-dashed border-ink/30 pb-3">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-16 w-16 border-2 border-ink object-cover" />
                ) : (
                  <div className="h-16 w-16 border-2 border-ink bg-bone" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                    <button
                      onClick={() => decrease(product._id)}
                      aria-label={`Quitar una unidad de ${product.name}`}
                      className="h-7 w-7 border-2 border-ink bg-paper leading-none hover:bg-bone"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-ink">{product.quantity}</span>
                    <button
                      onClick={() => add(product)}
                      aria-label={`Agregar una unidad de ${product.name}`}
                      className="h-7 w-7 border-2 border-ink bg-paper leading-none hover:bg-bone"
                    >
                      +
                    </button>
                    <span>× ${Number(product.price).toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
                <button onClick={() => remove(product._id)} className="text-xs font-semibold text-magenta underline">
                  Quitar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 border-t-2 border-dashed border-ink px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-ink/60">Total</span>
            <span className="font-display text-3xl leading-none">
              ${total.toLocaleString('es-CO')}
              <span className="ml-1 font-sans text-xs font-semibold text-ink/60">COP</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clear}
              disabled={!items.length}
              className="btn btn-ghost flex-1 px-3 py-2 disabled:opacity-40"
            >
              Vaciar
            </button>
            <button
              onClick={checkout}
              disabled={!items.length}
              className="btn btn-primary flex-1 px-3 py-2 disabled:opacity-40"
            >
              Comprar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
