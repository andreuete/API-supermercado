import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Package, CalendarDays, Tag, Barcode, Layers3 } from 'lucide-react'

const date = (value) => value ? new Date(value).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
export default function ProductDetail({ product }) {
  const id = product?.id ?? product?._id
  return <div className="panel p-6 md:p-9">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-brand"><Package size={26} /></div><div><p className="text-xs font-bold uppercase tracking-widest text-brand">Detalle de producto</p><h2 className="mt-1 text-2xl font-extrabold">{product.nombre}</h2><p className="mt-1 text-sm text-slate-500">{product.marca || 'Sin marca'}</p></div></div><Link to={`/products/${id}/edit`} className="btn-primary"><Pencil size={16} /> Editar</Link></div>
    <div className="my-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[['Categoría', product.categoria, Tag], ['Precio', Number(product.precio || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), Package], ['Stock', `${product.stock ?? 0} unidades`, Layers3], ['Slug', product.slug || '—', Barcode], ['Estado', product.status || (product.isActive ? 'active' : 'inactive'), Tag], ['Creado', date(product.createdAt), CalendarDays], ['Actualizado', date(product.updatedAt), CalendarDays], ['Eliminado', date(product.deletedAt), CalendarDays]].map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><Icon size={14} />{label}</div><div className="mt-2 break-words text-sm font-bold text-slate-800">{String(value ?? '—')}</div></div>)}
    </div>
    <div className="rounded-xl bg-slate-50 p-5"><h3 className="text-sm font-bold">Descripción</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{product.descripcion || 'No hay una descripción para este producto.'}</p></div>
    <Link to="/" className="btn-secondary mt-6"><ArrowLeft size={16} /> Volver al inventario</Link>
  </div>
}