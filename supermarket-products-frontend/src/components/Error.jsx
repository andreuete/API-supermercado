import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ title = 'Algo salió mal', message = 'No se pudo cargar la información.', onRetry }) {
  return <div role="alert" className="panel flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-rose-600"><AlertTriangle size={24} /></div>
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="mt-2 max-w-md whitespace-pre-line text-sm leading-6 text-slate-500">{message}</p>
    {onRetry && <button onClick={onRetry} className="btn-secondary mt-5"><RefreshCw size={16} /> Reintentar</button>}
  </div>
}