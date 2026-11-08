import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'shopping_cart'

function readCart() {
  try {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEY))?.products
    return Array.isArray(products) ? products : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: items }))
  }, [items])

  const add = (product) =>
    setItems((list) => {
      const index = list.findIndex((p) => p._id === product._id)
      if (index === -1) return [...list, { ...product, quantity: 1 }]
      const next = [...list]
      next[index] = { ...next[index], quantity: (next[index].quantity || 0) + 1 }
      return next
    })

  const decrease = (id) =>
    setItems((list) =>
      list.flatMap((p) =>
        p._id !== id ? [p] : p.quantity > 1 ? [{ ...p, quantity: p.quantity - 1 }] : [],
      ),
    )

  const remove = (id) => setItems((list) => list.filter((p) => p._id !== id))
  const clear = () => setItems([])

  const value = useMemo(() => {
    const total = items.reduce((sum, p) => sum + p.price * p.quantity, 0)
    const count = items.reduce((n, p) => n + p.quantity, 0)
    return { items, add, decrease, remove, clear, total, count }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
