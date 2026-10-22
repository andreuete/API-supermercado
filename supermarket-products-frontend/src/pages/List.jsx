import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownToLine, Boxes, PackageCheck, PackageX, Plus, RefreshCw, TrendingUp } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import Datatable from '../components/Datatable'
import ErrorState from '../components/Error'
import { confirmAction, notifyError, notifySuccess } from '../utils/alerts'
import { getErrorMessage } from '../utils/errorHandler'

export default function List() {
  const { products, loading, error, refresh, softDeleteProduct, restoreProduct, deleteProduct, toggleActive, changeStatus } = useProducts()
  useEffect(() => { refresh().catch(() => {}) }, [])
  const active = products.filter((p) => p.isActive === true || p.status === 'active').length
  const inactive = products.filter((p) => p.isActive === false || (p.status && p.status !== 'active' && !p.deletedAt)).length
  const lowStock = products.filter((p) => Number(p.stock) <= 5 && !p.deletedAt).length
  const action = async (product, fn, title, text, confirmText) => {
    const ok = await confirmAction({ title, text, confirmText })
    if (!ok) return
    try { await fn(product); } catch (e) { /* hook ya notifica */ }
  }
  const onSoftDelete = (p) => action(p, (x) => softDeleteProduct(x.id ?? x._id), '¿Enviar a papelera?', `“${p.nombre}” se podrá restaurar más tarde.`, 'Mover a papelera')
  const onRestore = (p) => action(p, (x) => restoreProduct(x.id ?? x._id), '¿Restaurar producto?', `“${p.nombre}” volverá al catálogo.`, 'Restaurar')
  const onDelete = (p) => action(p, (x) => deleteProduct(x.id ?? x._id), '¿Eliminar definitivamente?', `“${p.nombre}” se borrará de forma permanente. Esta acción no se puede deshacer.`, 'Eliminar definitivamente')
  const onToggleActive = (p) => action(p, (x) => toggleActive(x.id ?? x._id, !(x.isActive ?? x.status === 'active')), p.isActive ? '¿Desactivar producto?' : '¿Activar producto?', `Cambiar la visibilidad de “${p.nombre}”.`, 'Cambiar estado')
  const onChangeStatus = async (p) => {
    const current = p.status || (p.isActive ? 'active' : 'inactive')
    const next = window.prompt('Introduce el nuevo status (ej. active, inactive, discontinued):', current)
    if (!next || next === current) return
    try { await changeStatus(p.id ?? p._id, next.trim()) } catch (e) {}
  }
  const exportCsv = () => {
    const headers = ['nombre','categoria','precio','stock','marca','status','isActive']
    const escape = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`
    const csv = [headers.join(';'), ...products.map((p) => headers.map((h) => escape(p[h])).join(';'))].join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = 'inventario-productos.csv'; a.click(); URL.revokeObjectURL(url)
    notifySuccess('CSV exportado', 'Se ha generado el archivo del inventario.')
  }
  return <div className="space-y-7">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-brand"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Panel de control</div><h2 className="text-3xl font-extrabold tracking-tight">Inventario <span className="text-brand">general</span></h2><p className="mt-2 text-sm text-slate-500">Administra tus productos, disponibilidad y catálogo desde un solo lugar.</p></div><div className="flex gap-2"><button onClick={exportCsv} className="btn-secondary"><ArrowDownToLine size={16} /> Exportar CSV</button><Link to="/products/new" className="btn-primary"><Plus size={16} /> Añadir producto</Link></div></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Productos totales', value: products.length, icon: Boxes, color: 'bg-blue-50 text-blue-600', foot: 'En el catálogo' },
        { label: 'Productos activos', value: active, icon: PackageCheck, color: 'bg-emerald-50 text-brand', foot: 'Disponibles para venta' },
        { label: 'Stock bajo', value: lowStock, icon: PackageX, color: 'bg-amber-50 text-amber-600', foot: '5 unidades o menos' },
        { label: 'Otros estados', value: inactive, icon: TrendingUp, color: 'bg-violet-50 text-violet-600', foot: 'Inactivos o pendientes' },
      ].map(({ label, value, icon: Icon, color, foot }) => <div key={label} className="panel p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p></div><div className={`rounded-xl p-3 ${color}`}><Icon size={20} /></div></div><p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">{foot}</p></div>)}
    </section>
    {error ? <ErrorState message={error} onRetry={() => refresh().catch(() => {})} /> :
      <Datatable products={products} loading={loading} onSoftDelete={onSoftDelete} onRestore={onRestore} onDelete={onDelete} onToggleActive={onToggleActive} onChangeStatus={onChangeStatus} />}
    <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3"><p className="text-xs text-slate-500">Los cambios se sincronizan con la API REST.</p><button onClick={() => refresh().catch((e) => notifyError(getErrorMessage(e)))} className="inline-flex items-center gap-2 text-xs font-semibold text-brand hover:underline"><RefreshCw size={14} /> Actualizar datos</button></div>
  </div>
}