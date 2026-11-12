import { Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import ErrorState from '../../components/Error'
import { FormSkeleton } from '../../components/Skeleton'
import { idOf } from '../../utils/recordIds'

const config = {
  variant: { plural: 'variants', label: 'variante', title: 'Variante' },
  user: { plural: 'users', label: 'usuario', title: 'Usuario' },
  role: { plural: 'roles', label: 'rol', title: 'Rol' },
}

export default function ManagementForm({
  entity,
  mode,
  values,
  products,
  roles,
  loading,
  loadError,
  submitError,
  mutating,
  onRetry,
  onFieldChange,
  onRoleChange,
  onSubmit,
}) {
  const { plural, label } = config[entity]

  if (loading) return <div className="mx-auto max-w-3xl panel"><FormSkeleton /></div>
  if (loadError) return <ErrorState title={`No se pudo cargar el ${label}`} message={loadError} onRetry={onRetry} />

  return <div className="mx-auto max-w-3xl">
    <div className="mb-6"><h2 className="text-2xl font-bold">{mode === 'edit' ? `Editar ${label}` : `Crear ${label}`}</h2><p className="mt-1 text-sm text-slate-500">Completa los datos del {label}.</p></div>
    <form onSubmit={onSubmit} className="panel p-5 md:p-8">
      <div className="grid gap-5">
        {entity === 'variant' && <>
          <div><label className="field-label" htmlFor="variant-product">Producto<span className="ml-1 text-rose-500">*</span></label><select id="variant-product" value={values.productId} onChange={(event) => onFieldChange('productId', event.target.value)} className="field" required disabled={mode === 'edit'}><option value="">Selecciona un producto</option>{products.map((product) => <option key={idOf(product)} value={idOf(product)}>{product.name}</option>)}</select></div>
          <div><label className="field-label" htmlFor="variant-sku">SKU<span className="ml-1 text-xs font-normal text-slate-400">(opcional)</span></label><input id="variant-sku" value={values.sku} onChange={(event) => onFieldChange('sku', event.target.value)} className="field" disabled={mode === 'edit'} /><p className="mt-1 text-xs text-slate-400">Si se deja vacío, se generará automáticamente.</p></div>
          <div className="grid gap-5 sm:grid-cols-2"><div><label className="field-label" htmlFor="variant-price">Precio (€)<span className="ml-1 text-rose-500">*</span></label><input id="variant-price" type="number" min="0" step="0.01" value={values.price} onChange={(event) => onFieldChange('price', event.target.value)} className="field" required /></div><div><label className="field-label" htmlFor="variant-stock">Stock<span className="ml-1 text-rose-500">*</span></label><input id="variant-stock" type="number" min="0" step="1" value={values.stock} onChange={(event) => onFieldChange('stock', event.target.value)} className="field" required /></div></div>
          <div><label className="field-label" htmlFor="variant-attributes">Atributos (JSON)</label><textarea id="variant-attributes" rows="5" value={values.attributes} onChange={(event) => onFieldChange('attributes', event.target.value)} className="field resize-y font-mono text-xs" /><p className="mt-1.5 text-xs text-slate-400">Por ejemplo: {`{"talla":"L","color":"rojo"}`}</p></div>
        </>}
        {entity === 'user' && <>
          <div><label className="field-label" htmlFor="user-name">Nombre completo<span className="ml-1 text-rose-500">*</span></label><input id="user-name" value={values.full_name} onChange={(event) => onFieldChange('full_name', event.target.value)} className="field" required minLength={2} /></div>
          <div><label className="field-label" htmlFor="user-email">Correo electrónico<span className="ml-1 text-rose-500">*</span></label><input id="user-email" type="email" autoComplete="email" value={values.email} onChange={(event) => onFieldChange('email', event.target.value)} className="field" required /></div>
          <div><label className="field-label" htmlFor="user-password">Contraseña{mode === 'create' && <span className="ml-1 text-rose-500">*</span>}</label><input id="user-password" type="password" autoComplete="new-password" value={values.password} onChange={(event) => onFieldChange('password', event.target.value)} className="field" minLength={8} required={mode === 'create'} />{mode === 'edit' && <p className="mt-1.5 text-xs text-slate-400">Déjala vacía para conservar la contraseña actual.</p>}</div>
          <fieldset><legend className="field-label">Roles</legend><div className="grid gap-2 sm:grid-cols-2">{roles.map((role) => <label key={idOf(role)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"><input type="checkbox" checked={values.role_ids.includes(idOf(role))} onChange={(event) => onRoleChange(idOf(role), event.target.checked)} />{role.name}</label>)}</div>{roles.length === 0 && <p className="text-xs text-slate-500">No hay roles disponibles.</p>}</fieldset>
        </>}
        {entity === 'role' && <>
          <div><label className="field-label" htmlFor="role-name">Nombre<span className="ml-1 text-rose-500">*</span></label><input id="role-name" value={values.name} onChange={(event) => onFieldChange('name', event.target.value)} className="field" required minLength={2} /></div>
          <div><label className="field-label" htmlFor="role-permissions">Permisos</label><textarea id="role-permissions" rows="6" value={values.permissions} onChange={(event) => onFieldChange('permissions', event.target.value)} className="field resize-y" /><p className="mt-1.5 text-xs text-slate-400">Introduce un permiso por línea.</p></div>
        </>}
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={values.is_active} onChange={(event) => onFieldChange('is_active', event.target.checked)} /> Registro activo</label>
      </div>
      {submitError && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <Link to={`/${plural}`} className="btn-secondary"><ArrowLeft size={16} /> Volver a {plural}</Link>
        <button type="submit" disabled={mutating} className="btn-primary"><Save size={16} />{mutating ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : `Crear ${label}`}</button>
      </div>
    </form>
  </div>
}
