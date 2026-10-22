import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, RotateCcw, Power, MoreHorizontal, Package, ArrowUpDown } from 'lucide-react'

const getId = (p) => p?.id ?? p?._id
const isDeleted = (p) => Boolean(p?.deletedAt) || ['deleted', 'deleted_at', 'soft-deleted'].includes(String(p?.status || '').toLowerCase())
const isActive = (p) => p?.isActive === true || String(p?.status).toLowerCase() === 'active'

function StatusBadge({ product }) {
  const deleted = isDeleted(product)
  const active = isActive(product)
  const style = deleted ? 'bg-rose-50 text-rose-700' : active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
  const label = deleted ? 'En papelera' : active ? 'Activo' : 'Inactivo'
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{label}</span>
}

export default function Datatable({ products = [], loading, onSoftDelete, onRestore, onDelete, onToggleActive, onChangeStatus }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [sort, setSort] = useState({ key: 'nombre', direction: 'asc' })
  const filtered = useMemo(() => {
    const q = search.toLocaleLowerCase().trim()
    return products.filter((p) => {
      const matches = !q || [p.nombre, p.categoria, p.marca, p.slug].some((v) => String(v || '').toLocaleLowerCase().includes(q))
      const deleted = isDeleted(p)
      const matchesStatus = status === 'all' || (status === 'active' && !deleted && isActive(p)) || (status === 'inactive' && !deleted && !isActive(p)) || (status === 'deleted' && deleted)
      return matches && matchesStatus
    }).sort((a, b) => {
      const av = a?.[sort.key] ?? ''
      const bv = b?.[sort.key] ?? ''
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'es', { numeric: true })
      return sort.direction === 'asc' ? cmp : -cmp
    })
  }, [products, search, status, sort])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pages)
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const toggleSort = (key) => { setSort((s) => ({ key, direction: s.key === key && s.direction === 'asc' ? 'desc' : 'asc' })); setPage(1) }

  return <div className="panel overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between md:px-6">
      <div><h2 className="font-bold">Catálogo de productos</h2><p className="mt-1 text-xs text-slate-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p></div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field min-w-0 py-2.5 pl-9 sm:w-60" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar producto..." aria-label="Buscar producto" /></label>
        <select className="field py-2.5 sm:w-40" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} aria-label="Filtrar por estado">
          <option value="all">Todos los estados</option><option value="active">Activos</option><option value="inactive">Inactivos</option><option value="deleted">En papelera</option>
        </select>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-400"><tr>
          {[['nombre','Producto'],['categoria','Categoría'],['precio','Precio'],['stock','Stock']].map(([key,label]) => <th key={key} className="px-6 py-4 font-semibold"><button className="inline-flex items-center gap-1.5 hover:text-slate-700" onClick={() => toggleSort(key)}>{label}<ArrowUpDown size={12} /></button></th>)}
          <th className="px-6 py-4 font-semibold">Estado</th><th className="px-6 py-4 text-right font-semibold">Acciones</th>
        </tr></thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse">{Array.from({ length: 6 }).map((__, j) => <td key={j} className="px-6 py-5"><div className="h-4 rounded bg-slate-100" /></td>)}</tr>) :
          rows.length ? rows.map((p) => {
            const id = getId(p); const deleted = isDeleted(p)
            return <tr key={id} className="transition hover:bg-slate-50/70">
              <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-brand"><Package size={18} /></div><div><div className="font-semibold text-slate-800">{p.nombre || 'Sin nombre'}</div><div className="mt-0.5 text-xs text-slate-400">{p.marca || 'Sin marca'}</div></div></div></td>
              <td className="px-6 py-4 text-slate-500">{p.categoria || '—'}</td>
              <td className="px-6 py-4 font-semibold tabular-nums">{Number(p.precio || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
              <td className="px-6 py-4"><span className={`font-semibold ${Number(p.stock) <= 5 ? 'text-amber-600' : 'text-slate-700'}`}>{p.stock ?? 0}</span><span className="ml-1 text-xs text-slate-400">uds.</span></td>
              <td className="px-6 py-4"><StatusBadge product={p} /></td>
              <td className="px-6 py-4"><div className="flex items-center justify-end gap-1">
                <Link title="Ver detalle" to={`/products/${id}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Eye size={16} /></Link>
                {!deleted && <Link title="Editar" to={`/products/${id}/edit`} className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-brand"><Pencil size={16} /></Link>}
                {deleted ? <button title="Restaurar" onClick={() => onRestore(p)} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"><RotateCcw size={16} /></button> : <>
                  <button title={isActive(p) ? 'Desactivar' : 'Activar'} onClick={() => onToggleActive(p)} className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-700"><Power size={16} /></button>
                  <button title="Cambiar status" onClick={() => onChangeStatus(p)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal size={16} /></button>
                  <button title="Enviar a papelera" onClick={() => onSoftDelete(p)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
                </>}
                <button title="Borrado físico" onClick={() => onDelete(p)} className="rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-700"><Trash2 size={16} /></button>
              </div></td>
            </tr>
          }) : <tr><td colSpan="6" className="px-6 py-16 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400"><Package size={22} /></div><p className="font-semibold text-slate-700">No hay productos para mostrar</p><p className="mt-1 text-sm text-slate-400">Prueba otro filtro o registra un producto nuevo.</p></td></tr>}
        </tbody>
      </table>
    </div>
    <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between md:px-6">
      <div className="flex items-center gap-2">Filas por página <select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}><option value={8}>8</option><option value={15}>15</option><option value={25}>25</option></select><span className="ml-2">Mostrando {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} de {filtered.length}</span></div>
      <div className="flex items-center gap-2"><button disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={16} /></button><span>Página <b className="text-slate-700">{currentPage}</b> de {pages}</span><button disabled={currentPage >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40" aria-label="Página siguiente"><ChevronRight size={16} /></button></div>
    </div>
  </div>
}