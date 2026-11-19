import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, permission }) {
  const { isAuthenticated, hasPermission } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (permission && !hasPermission(permission)) {
    return <main className="mx-auto max-w-3xl px-4 py-16">
      <section className="panel p-8 text-center">
        <h1 className="text-xl font-bold">Acceso denegado</h1>
        <p className="mt-3 text-sm text-slate-500">Tu usuario no tiene permisos para acceder a esta sección.</p>
        <Link to="/" className="btn-primary mt-6">Volver al inventario</Link>
      </section>
    </main>
  }

  return children
}
