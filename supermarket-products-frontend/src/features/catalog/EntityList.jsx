import { Link } from 'react-router-dom'
import { Plus, Pencil, Tags, Boxes } from 'lucide-react'
import ErrorState from '../../components/Error'
import { entityId } from '../../utils/recordIds'

const config = {
  brand: { label: 'Marcas', singular: 'marca', icon: Tags, path: 'brands' },
  category: { label: 'Categorías', singular: 'categoría', icon: Boxes, path: 'categories' },
}

export default function EntityList({ entity, rows, loading, error, onRetry }) {
  const { label, singular, icon: Icon, path } = config[entity]

  if (error) return <ErrorState title={`No se pudieron cargar las ${label.toLowerCase()}`} message={error} onRetry={onRetry} />

  return <section className="space-y-5">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-brand"><Icon size={14} /> Gestión del catálogo</div><h2 className="text-3xl font-bold tracking-tight">{label}</h2><p className="mt-2 text-sm text-slate-500">Consulta y administra las {label.toLowerCase()} disponibles para el catálogo.</p></div>
    </div>
    <div className="panel overflow-hidden">
      {loading ? <div className="animate-pulse space-y-3 p-5" aria-label={`Cargando ${label.toLowerCase()}`}><div className="h-10 rounded-xl bg-slate-100" />{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-12 rounded-lg bg-slate-100" />)}</div>
        : rows.length === 0 ? <div className="px-6 py-14 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-brand"><Icon size={22} /></div><h3 className="mt-4 text-base font-bold">Todavía no hay {label.toLowerCase()}</h3><p className="mt-1 text-sm text-slate-500">Crea la primera {singular} para añadirla al catálogo.</p><Link to={`/${path}/new`} className="btn-primary mt-5"><Plus size={16} /> Crear {singular}</Link></div>
          : <div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Nombre</th>{entity === 'category' && <th className="px-5 py-3">Categoría padre</th>}{entity === 'category' && <th className="px-5 py-3">Descripción</th>}<th className="px-5 py-3">Estado</th><th className="px-5 py-3 text-right">Acciones</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={entityId(row)} className="hover:bg-slate-50/70">
              <td className="px-5 py-4 font-semibold text-slate-800">{row.name}</td>
              {entity === 'category' && <td className="px-5 py-4 text-slate-500">{row.parent_id?.name || '—'}</td>}
              {entity === 'category' && <td className="max-w-sm truncate px-5 py-4 text-slate-500">{row.description || '—'}</td>}
              <td className="px-5 py-4"><span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${row.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{row.is_active ? 'Activa' : 'Inactiva'}</span></td>
              <td className="px-5 py-4 text-right"><Link to={`/${path}/${entityId(row)}/edit`} className="btn-secondary"><Pencil size={14} /> Editar</Link></td>
            </tr>)}</tbody>
          </table></div>}
    </div>
  </section>
}
