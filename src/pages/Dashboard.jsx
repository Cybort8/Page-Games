import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const CATEGORIES = ['Todos', 'Acción', 'Lucha', 'Aventura', 'Arcade', 'Deportes', 'Estrategia', 'Simulación']

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  discount: '',
  category: 'Todos',
  type: '',
  features: [''],
}

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState(null)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const load = async () => {
    try {
      setProducts(await api.listProducts())
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const setFeature = (index, value) =>
    setForm((current) => {
      const features = [...current.features]
      features[index] = value
      return { ...current, features }
    })

  const reset = () => {
    setForm(EMPTY_FORM)
    setImage(null)
    setEditing(null)
  }

  const edit = (product) => {
    setEditing(product._id)
    setImage(null)
    setForm({
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price ?? '',
      oldPrice: product.oldPrice ?? '',
      discount: product.discount ?? '',
      category: product.category ?? 'Todos',
      type: product.type ?? '',
      features: product.features?.length ? product.features : [''],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    const data = {
      name: form.name,
      description: form.description,
      price: form.price,
      oldPrice: form.oldPrice,
      discount: form.discount,
      category: form.category,
      type: form.type,
      features: form.features.filter(Boolean),
    }

    try {
      if (editing) {
        if (image) {
          const body = new FormData()
          body.append('data', JSON.stringify(data))
          body.append('image', image)
          await api.updateProduct(editing, body)
        } else {
          await api.updateProductJson(editing, data)
        }
        setMessage('Guardamos los cambios del producto.')
      } else {
        const body = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'features') body.append(key, value)
        })
        data.features.forEach((feature, index) => body.append(`features[${index}]`, feature))
        if (image) body.append('image', image)
        await api.createProduct(body)
        setMessage('Publicamos el producto en el catálogo.')
      }

      reset()
      await load()
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleHighlight = async (product) => {
    try {
      await api.highlightProduct(product._id, !product.isFeatured)
      setProducts((list) =>
        list.map((item) => (item._id === product._id ? { ...item, isFeatured: !item.isFeatured } : item)),
      )
    } catch (err) {
      setMessage(err.message)
    }
  }

  const remove = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return
    try {
      await api.deleteProduct(product._id)
      setProducts((list) => list.filter((item) => item._id !== product._id))
    } catch (err) {
      setMessage(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="sign text-4xl sm:text-5xl">Panel</h1>
          <p className="mt-1 text-sm text-ink/60">Publica, edita y destaca los juegos del catálogo.</p>
        </div>
        <button onClick={logout} className="btn btn-ghost px-4 py-2">
          Cerrar sesión
        </button>
      </div>

      {message && (
        <p className="mt-6 border-2 border-ink bg-sun p-3 text-sm shadow-sticker" role="status">
          {message}
        </p>
      )}

      <form onSubmit={submit} className="mt-8 border-2 border-ink bg-paper shadow-sticker">
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <h2 className="sign text-2xl">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
          {editing && <span className="sticker bg-cobalt text-white">Editando</span>}
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Nombre
            <input value={form.name} onChange={update('name')} required className="field" />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Descripción
            <input value={form.description} onChange={update('description')} required className="field" />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Precio (COP)
            <input type="number" min="0" value={form.price} onChange={update('price')} required className="field" />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Precio anterior (COP)
            <input type="number" min="0" value={form.oldPrice} onChange={update('oldPrice')} className="field" />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Descuento
            <input type="number" min="0" value={form.discount} onChange={update('discount')} className="field" />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Categoría
            <select value={form.category} onChange={update('category')} className="field">
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Tipo
            <input value={form.type} onChange={update('type')} className="field" />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Imagen
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              className="field file:mr-3 file:border-0 file:bg-bone file:px-3 file:py-1 file:text-xs file:font-semibold"
            />
          </label>

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-semibold">Características</p>
            <div className="space-y-2">
              {form.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={feature}
                    onChange={(event) => setFeature(index, event.target.value)}
                    className="field flex-1"
                    placeholder="Ej. Modo campaña para un jugador"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        features: current.features.filter((_, i) => i !== index),
                      }))
                    }
                    className="border-2 border-ink bg-paper px-3 text-xs font-semibold hover:bg-bone"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, features: [...current.features, ''] }))}
              className="mt-2 text-sm font-semibold text-cobalt underline"
            >
              Añadir característica
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t-2 border-ink px-5 py-4">
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-50">
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Publicar producto'}
          </button>
          {editing && (
            <button type="button" onClick={reset} className="btn btn-ghost">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="sign text-3xl">Productos</h2>
          <span className="sticker bg-sun">
            {products.length} {products.length === 1 ? 'juego' : 'juegos'}
          </span>
        </div>

        {loading ? (
          <p className="mt-4 text-ink/60">Cargando...</p>
        ) : products.length === 0 ? (
          <div className="mt-4 border-2 border-ink bg-bone p-8 text-center shadow-sticker">
            <p className="sign text-3xl">Catálogo vacío</p>
            <p className="mt-2 text-sm text-ink/70">Publica el primer juego con el formulario de arriba.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex flex-wrap items-center gap-3 border-2 border-ink bg-paper p-3 shadow-sticker"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 border-2 border-ink object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 border-2 border-ink bg-bone" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.name}</p>
                  <p className="text-sm text-ink/60">
                    ${Number(product.price).toLocaleString('es-CO')} COP · {product.category}
                  </p>
                </div>
                <button
                  onClick={() => toggleHighlight(product)}
                  className={`border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                    product.isFeatured ? 'bg-sun text-ink' : 'bg-bone text-ink/70'
                  }`}
                >
                  {product.isFeatured ? 'Destacado' : 'Destacar'}
                </button>
                <button
                  onClick={() => edit(product)}
                  className="border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-bone"
                >
                  Editar
                </button>
                <button
                  onClick={() => remove(product)}
                  className="border-2 border-ink bg-magenta px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
