import { Link } from 'react-router-dom'
import { Boxes, KeyRound, Pencil, Plus, Shield, Users } from 'lucide-react'
import ErrorState from '../../components/Error'
import { idOf } from '../../utils/recordIds'

const config = {
  variant: { plural: 'variants', label: 'Variantes', singular: 'variante', icon: Boxes },
  user: { plural: 'users', label: 'Usuarios', singular: 'usuario', icon: Users },
  role: { plural: 'roles', label: 'Roles', singular: 'rol', icon: Shield },
}

const statusLabel = (record) => record.is_active ? 'Activo' : 'Inactivo'

export default function ManagementList({ entity, records, loading, error, refresh }) {
  const { plural, label, singular, icon: Icon } = config[entity]

  const editPath = (record) => entity === 'variant'
    ? `/variants/${encodeURIComponent(record.productId)}/${encodeURIComponent(record.sku)}/edit`
    : `/${plural}/${encodeURIComponent(idOf(record))}/edit`

  if (error) return <ErrorState title={`No se pudieron cargar ${label.toLowerCase()}`} message={error} onRetry={() => refresh().catch(() => {})} />

  return <section className="space-y-5">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-brand"><Icon size={14} /> Gestión del sistema</div><h2 className="text-3xl font-bold tracking-tight">{label}</h2><p className="mt-2 text-sm text-slate-500">Consulta y administra {label.toLowerCase()}.</p></div>
    </div>
    <div className="panel overflow-hidden">
      {loading ? <div className="animate-pulse space-y-3 p-5" aria-label={`Cargando ${label.toLowerCase()}`}><div className="h-10 rounded-xl bg-slate-100" />{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-12 rounded-lg bg-slate-100" />)}</div>
        : records.length === 0 ? <div className="px-6 py-14 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-brand"><Icon size={22} /></div><h3 className="mt-4 text-base font-bold">Todavía no hay {label.toLowerCase()}</h3><p className="mt-1 text-sm text-slate-500">Crea el primer registro para empezar.</p><Link to={`/${plural}/new`} className="btn-primary mt-5"><Plus size={16} /> Crear {singular}</Link></div>
          : <div className="overflow-x-auto"><table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>
              {entity === 'variant' ? <><th className="px-5 py-3">SKU</th><th className="px-5 py-3">Producto</th><th className="px-5 py-3">Precio</th><th className="px-5 py-3">Stock</th></>
                : entity === 'user' ? <><th className="px-5 py-3">Nombre</th><th className="px-5 py-3">Correo</th><th className="px-5 py-3">Roles</th><th className="px-5 py-3">Estado</th></>
                  : <><th className="px-5 py-3">Rol</th><th className="px-5 py-3">Permisos</th><th className="px-5 py-3">Estado</th></>}
              <th className="px-5 py-3 text-right">Acciones</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{records.map((record, index) => <tr key={entity === 'variant' ? `${record.productId}-${record.sku}` : idOf(record) || index} className="hover:bg-slate-50/70">
              {entity === 'variant' ? <>
                <td className="px-5 py-4 font-semibold text-slate-800">{record.sku}</td><td className="px-5 py-4 text-slate-600">{record.productName || 'Producto'}</td><td className="px-5 py-4 tabular-nums">{Number(record.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td><td className="px-5 py-4">{record.stock}</td>
              </> : entity === 'user' ? <>
                <td className="px-5 py-4 font-semibold text-slate-800">{record.full_name}</td><td className="px-5 py-4 text-slate-600">{record.email}</td><td className="px-5 py-4 text-slate-500">{(record.role_ids || []).map((role) => role.name || role).join(', ') || '—'}</td><td className="px-5 py-4">{statusLabel(record)}</td>
              </> : <>
                <td className="px-5 py-4 font-semibold text-slate-800">{record.name}</td><td className="px-5 py-4 text-slate-500">{(record.permissions || []).join(', ') || 'Sin permisos'}</td><td className="px-5 py-4">{statusLabel(record)}</td>
              </>}
              <td className="px-5 py-4 text-right"><Link to={editPath(record)} className="btn-secondary"><Pencil size={14} /> Editar</Link></td>
            </tr>)}</tbody>
          </table></div>}
    </div>
  </section>
}
