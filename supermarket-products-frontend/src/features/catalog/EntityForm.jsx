import { Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import ErrorState from '../../components/Error'
import { FormSkeleton } from '../../components/Skeleton'
import { entityId } from '../../utils/recordIds'

export default function EntityForm({
  entity,
  mode,
  config,
  id,
  values,
  categories,
  loading,
  loadError,
  nameError,
  mutating,
  onChange,
  onSubmit,
  onRetry,
}) {
  if (loading) return <div className="mx-auto max-w-3xl panel"><FormSkeleton /></div>
  if (loadError) return <ErrorState title={`No se pudo cargar la ${config.label}`} message={loadError} onRetry={onRetry} />

  return <div className="mx-auto max-w-3xl">
    <div className="mb-6"><h2 className="text-2xl font-bold">{mode === 'edit' ? `Editar ${config.label}` : `Crear ${config.label}`}</h2><p className="mt-1 text-sm text-slate-500">Completa los datos de la {config.label} del catálogo.</p></div>
    <form onSubmit={onSubmit} className="panel p-5 md:p-8">
      <div className="grid gap-5">
        <div><label className="field-label" htmlFor="entity-name">Nombre<span className="ml-1 text-rose-500">*</span></label><input id="entity-name" value={values.name} onChange={(event) => onChange('name', event.target.value)} className={`field ${nameError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`} aria-invalid={Boolean(nameError)} required minLength={2} />{nameError && <p className="mt-1.5 text-xs text-rose-600">{nameError}</p>}</div>
        {config.hasDescription && <>
          <div><label className="field-label" htmlFor="entity-description">Descripción</label><textarea id="entity-description" rows="4" value={values.description} onChange={(event) => onChange('description', event.target.value)} className="field resize-y" /></div>
          <div><label className="field-label" htmlFor="entity-parent">Categoría padre</label><select id="entity-parent" value={values.parent_id} onChange={(event) => onChange('parent_id', event.target.value)} className="field"><option value="">Sin categoría padre</option>{categories.map((category) => <option key={entityId(category)} value={entityId(category)}>{category.name}</option>)}</select></div>
        </>}
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <Link to={`/${config.plural}`} className="btn-secondary"><ArrowLeft size={16} /> Volver a {config.plural === 'brands' ? 'marcas' : 'categorías'}</Link>
        <button type="submit" disabled={mutating} className="btn-primary"><Save size={16} />{mutating ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : `Crear ${config.label}`}</button>
      </div>
    </form>
  </div>
}
