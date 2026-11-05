import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Boxes, LayoutDashboard, Package, Plus, Shield, ShoppingBasket, Tags, Users } from 'lucide-react'

export default function AppLayout() {
  const location = useLocation()
  const section = ['brands', 'categories', 'variants', 'users', 'roles'].find((path) => location.pathname.startsWith(`/${path}`)) || 'products'
  const entityLabel = {
    brands: 'marca',
    categories: 'categoría',
    variants: 'variante',
    users: 'usuario',
    roles: 'rol',
    products: 'producto',
  }[section]
  const isCreate = location.pathname.endsWith('/new')
  const isEdit = location.pathname.endsWith('/edit')
  const createLabel = section === 'brands' || section === 'categories' ? 'Nueva' : 'Nuevo'
  const sectionLabel = {
    brands: 'Marcas',
    categories: 'Categorías',
    variants: 'Variantes',
    users: 'Usuarios',
    roles: 'Roles',
    products: 'Productos',
  }[section]
  const title = isCreate ? `${createLabel} ${entityLabel}` : isEdit ? `Editar ${entityLabel}` : section === 'products' ? 'Inventario' : sectionLabel
  const createPath = `/${section === 'products' ? 'products' : section}/new`
  return <div className="min-h-screen bg-canvas">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-100 bg-white px-5 py-7 lg:flex">
      <NavLink to="/" className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand text-white"><ShoppingBasket size={21} /></span>
        <span><span className="block text-lg font-bold tracking-tight">mercado<span className="text-brand">.</span></span><span className="block text-xs text-slate-400">Panel de gestión</span></span>
      </NavLink>
      <div className="mt-12 px-3 text-xs font-semibold tracking-wide text-slate-400">Secciones</div>
      <nav className="mt-3 space-y-1">
        <NavLink to="/" end className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard size={18} /> Inventario</NavLink>
        <NavLink to="/brands" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Tags size={18} /> Marcas</NavLink>
        <NavLink to="/categories" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Boxes size={18} /> Categorías</NavLink>
        <NavLink to="/variants" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Package size={18} /> Variantes</NavLink>
        <NavLink to="/users" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Users size={18} /> Usuarios</NavLink>
        <NavLink to="/roles" className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500 hover:bg-slate-50'}`}><Shield size={18} /> Roles</NavLink>
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold"><Boxes size={17} className="text-brand" /> Gestión de stock</div>
        <p className="text-xs leading-5 text-slate-500">Mantén tu catálogo actualizado y controla el estado de cada producto.</p>
      </div>
    </aside>
    <div className="lg:pl-64 pt-4">
      <header className="sticky top-4 z-10 mx-4 flex h-16 items-center justify-between rounded-2xl border border-slate-100 bg-white/90 px-4 shadow-soft backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-brand lg:hidden"><ShoppingBasket size={19} /></span>
          <div><div className="text-xs font-medium text-slate-400">Mercado / {sectionLabel}</div><h1 className="mt-0.5 text-base font-bold">{title}</h1></div>
        </div>
        <NavLink to={createPath} className="btn-primary"><Plus size={16} /><span className="hidden sm:inline">{createLabel} {entityLabel}</span><span className="sm:hidden">Nuevo</span></NavLink>
      </header>
      <nav aria-label="Secciones" className="mx-4 mt-3 grid grid-cols-3 gap-2 lg:hidden">
        <NavLink to="/" end className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500'}`}>Productos</NavLink>
        <NavLink to="/brands" className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500'}`}>Marcas</NavLink>
        <NavLink to="/categories" className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500'}`}>Categorías</NavLink>
        <NavLink to="/variants" className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500'}`}>Variantes</NavLink>
        <NavLink to="/users" className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500'}`}>Usuarios</NavLink>
        <NavLink to="/roles" className={({ isActive }) => `rounded-xl px-2 py-2 text-center text-sm font-semibold ${isActive ? 'bg-emerald-50 text-brand' : 'text-slate-500'}`}>Roles</NavLink>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-7 md:px-9 md:py-9"><Outlet /></main>
      <footer className="px-6 pb-6 text-center text-xs text-slate-400">Mercado · Panel de inventario</footer>
    </div>
  </div>
}