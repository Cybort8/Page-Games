import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await api.login(username, password)
      if (!token) throw new Error('La respuesta no incluyó un token')
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'No pudimos iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-b-2 border-ink bg-cobalt">
      <div className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-md border-2 border-ink bg-paper p-8 shadow-lift">
          <h1 className="sign text-4xl">Entrar al panel</h1>
          <p className="mt-2 text-sm text-ink/70">Acceso exclusivo para administración.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label htmlFor="username" className="flex flex-col gap-1 text-sm font-semibold">
              Usuario
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                autoComplete="username"
                className="field"
              />
            </label>

            <label htmlFor="password" className="flex flex-col gap-1 text-sm font-semibold">
              Contraseña
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="field"
              />
            </label>

            {error && (
              <p className="border-2 border-magenta bg-magenta/10 p-3 text-sm text-magenta" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
