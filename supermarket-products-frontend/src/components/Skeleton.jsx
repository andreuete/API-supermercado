export function TableSkeleton({ rows = 6 }) {
  return <div className="animate-pulse space-y-4 p-5" aria-label="Cargando productos">
    <div className="h-10 w-full rounded-xl bg-slate-100" />
    {Array.from({ length: rows }).map((_, i) => <div key={i} className="grid grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((n) => <div key={n} className="h-12 rounded-lg bg-slate-100" />)}
    </div>)}
  </div>
}
export function FormSkeleton() {
  return <div className="animate-pulse space-y-6 p-6">
    <div className="h-8 w-48 rounded bg-slate-100" />
    {[1, 2, 3, 4, 5].map((i) => <div key={i}><div className="mb-2 h-4 w-28 rounded bg-slate-100" /><div className="h-11 rounded-xl bg-slate-100" /></div>)}
  </div>
}
export default TableSkeleton