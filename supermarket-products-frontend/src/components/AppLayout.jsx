import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Boxes, LayoutDashboard, Plus, ShoppingBasket } from 'lucide-react'

export default function AppLayout() {
  const location = useLocation()
  const isCreate = location.pathname.endsWith('/new')
  const isEdit = location.pathname.includes('/edit/')
  const title = isCreate ? 'Nuevo producto' : isEdit ? 'Editar producto' : 'Inventario'
  return <div className="min-h-screen bg-canvas">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-100 bg-white px-5 py-7 lg:flex">
      <NavLink to="/" className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white"><ShoppingBasket size={21} /></span>
        <span><span className="block text-lg font-extrabold tracking-tight">mercado<span className="text-brand">.</span></span><span className="block text-xs text-slate-400">Panel de gestión</span></span>
      </NavLink>
      <div className="mt-12 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</div>
      <nav className="mt-3 space-y-1">
        <NavLink to="/" end className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard size={18} /> Inventario</NavLink>
        <NavLink to="/products/new" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Plus size={18} /> Añadir producto</NavLink>
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold"><Boxes size={17} className="text-brand" /> Gestión de stock</div>
        <p className="text-xs leading-5 text-slate-500">Mantén tu catálogo actualizado y controla el estado de cada producto.</p>
      </div>
    </aside>
    <div className="lg:pl-64">
      <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur md:px-9">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-brand lg:hidden"><ShoppingBasket size={19} /></span>
          <div><div className="text-xs font-medium text-slate-400">Mercado / Productos</div><h1 className="mt-0.5 text-base font-bold">{title}</h1></div>
        </div>
        <NavLink to="/products/new" className="btn-primary"><Plus size={16} /><span className="hidden sm:inline">Nuevo producto</span><span className="sm:hidden">Nuevo</span></NavLink>
      </header>
      <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-9 md:py-9"><Outlet /></main>
      <footer className="px-6 pb-6 text-center text-xs text-slate-400">Mercado · Panel de inventario</footer>
    </div>
  </div>
}