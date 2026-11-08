const BASE = import.meta.env.VITE_API_URL || 'https://backend-videojuegos.onrender.com'

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = localStorage.getItem('token')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.message || `HTTP ${res.status}`)
  return body
}

export const api = {
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),

  listProducts: () => request('/api/products'),
  getProduct: (id) => request(`/api/products/${id}`),

  createProduct: (formData) => request('/api/products', { method: 'POST', body: formData }),

  updateProduct: (id, formData) =>
    request(`/api/products/${id}`, { method: 'PUT', body: formData }),

  updateProductJson: (id, data) =>
    request(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  highlightProduct: (id, isFeatured) =>
    request(`/api/products/${id}/highlight`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured }),
    }),
}
