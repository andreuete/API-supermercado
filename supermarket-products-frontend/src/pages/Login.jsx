import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogIn, ShoppingBasket } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errorHandler'

export default function Login() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      const requestedPath = location.state?.from
      navigate(requestedPath?.pathname ? `${requestedPath.pathname}${requestedPath.search || ''}` : '/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="grid min-h-screen place-items-center bg-canvas px-4 py-12">
    <section className="panel w-full max-w-md p-7 shadow-soft sm:p-9">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white"><ShoppingBasket size={24} /></span>
        <div>
          <div className="text-xl font-bold tracking-tight">mercado<span className="text-brand">.</span></div>
          <p className="mt-1 text-sm text-slate-500">Panel de gestión</p>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-slate-500">Accede con tu cuenta para gestionar el inventario.</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="field-label">Correo electrónico</label>
          <input
            id="email"
            className="field"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">Contraseña</label>
          <input
            id="password"
            className="field"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          <LogIn size={17} /> {submitting ? 'Accediendo…' : 'Acceder'}
        </button>
      </form>
    </section>
  </main>
}
