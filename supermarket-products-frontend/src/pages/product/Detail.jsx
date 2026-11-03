import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Barcode, CalendarDays, Layers3, Package, Pencil, Tag } from 'lucide-react'
import { FormSkeleton } from '../../components/Skeleton'
import ErrorState from '../../components/Error'
import { useProducts } from '../../hooks/useProducts'

const date = (value) => value ? new Date(value).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

export default function Detail() {
  const { id } = useParams()
  const { getProduct } = useProducts({ autoLoad: false })
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    getProduct(id).then((p) => { if (alive) setProduct(p) }).catch((e) => { if (alive) setError(e?.response?.data?.message || 'No se pudo cargar el producto.') }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [id])
  if (loading) return <div className="panel"><FormSkeleton /></div>
  if (error || !product) return <ErrorState title="Producto no disponible" message={error || 'No se encontró el producto.'} onRetry={() => window.location.reload()} />
  const productId = product.id ?? product._id
  const prices = (product.variants || []).map((variant) => Number(variant.price)).filter(Number.isFinite)
  const price = prices.length
    ? `${Math.min(...prices).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}${Math.min(...prices) !== Math.max(...prices) ? ` – ${Math.max(...prices).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}` : ''}`
    : '—'
  const stock = (product.variants || []).reduce((total, variant) => total + Number(variant.stock || 0), 0)
  const fields = [
    ['Categoría', product.category?.name, Tag],
    ['Precio', price, Package],
    ['Stock', `${stock} unidades`, Layers3],
    ['Slug', product.slug || '—', Barcode],
    ['Estado', product.status || (product.is_active ? 'published' : 'inactive'), Tag],
    ['Creado', date(product.created_at), CalendarDays],
    ['Actualizado', date(product.updated_at), CalendarDays],
    ['Eliminado', date(product.deleted_at), CalendarDays],
  ]
  return <div className="panel p-6 md:p-9">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-brand"><Package size={26} /></div><div><p className="text-xs font-semibold tracking-wide text-brand">Detalle de producto</p><h2 className="mt-1 text-2xl font-bold">{product.name}</h2><p className="mt-1 text-sm text-slate-500">{product.brand?.name || 'Sin marca'}</p></div></div><Link to={`/products/${productId}/edit`} className="btn-primary"><Pencil size={16} /> Editar</Link></div>
    <div className="my-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><Icon size={14} />{label}</div><div className="mt-2 break-words text-sm font-bold text-slate-800">{String(value ?? '—')}</div></div>)}
    </div>
    <div className="rounded-xl bg-slate-50 p-5"><h3 className="text-sm font-bold">Descripción</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{product.description || 'No hay una descripción para este producto.'}</p></div>
    <Link to="/" className="btn-secondary mt-6"><ArrowLeft size={16} /> Volver al inventario</Link>
  </div>
}