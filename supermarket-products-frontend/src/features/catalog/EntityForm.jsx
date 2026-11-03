import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import ErrorState from '../../components/Error'
import { FormSkeleton } from '../../components/Skeleton'
import { createEntity, getEntity, listEntities, updateEntity, entityId } from '../../services/entityService'
import { getErrorMessage, logApiError } from '../../utils/errorHandler'
import { notifyError, notifySuccess } from '../../utils/alerts'

const entityConfig = {
  brand: { plural: 'brands', label: 'marca', title: 'Marca', description: false },
  category: { plural: 'categories', label: 'categoría', title: 'Categoría', description: true },
}

export default function EntityForm({ entity, mode }) {
  const config = entityConfig[entity]
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', description: '', parent_id: '' })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(mode === 'edit' || entity === 'category')
  const [loadError, setLoadError] = useState('')
  const [nameError, setNameError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoadError('')
    setLoading(true)
    const requests = [
      mode === 'edit' ? getEntity(entity, id) : Promise.resolve(null),
      entity === 'category' ? listEntities('category') : Promise.resolve([]),
    ]
    Promise.all(requests)
      .then(([record, categoryRows]) => {
        if (!active) return
        if (record) {
          setValues({
            name: record.name || '',
            description: record.description || '',
            parent_id: record.parent_id?.id ?? record.parent_id?._id ?? record.parent_id ?? '',
          })
        }
        setCategories(categoryRows.filter((category) => String(entityId(category)) !== String(id)))
      })
      .catch((error) => {
        if (active) {
          logApiError(error, `cargar ${config.label}`)
          setLoadError(getErrorMessage(error))
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [entity, id, mode, retry, config.label])

  const updateValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    if (field === 'name') setNameError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const name = values.name.trim()
    if (name.length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    const payload = config.description
      ? { name, description: values.description.trim(), parent_id: values.parent_id || null }
      : { name }
    setSubmitting(true)
    try {
      if (mode === 'edit') await updateEntity(entity, id, payload)
      else await createEntity(entity, payload)
      notifySuccess(mode === 'edit' ? `${config.title} actualizada` : `${config.title} creada`)
      navigate(`/${config.plural}`)
    } catch (error) {
      logApiError(error, `guardar ${config.label}`)
      notifyError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl panel"><FormSkeleton /></div>
  if (loadError) return <ErrorState title={`No se pudo cargar la ${config.label}`} message={loadError} onRetry={() => setRetry((count) => count + 1)} />

  return <div className="mx-auto max-w-3xl">
    <div className="mb-6"><h2 className="text-2xl font-bold">{mode === 'edit' ? `Editar ${config.label}` : `Crear ${config.label}`}</h2><p className="mt-1 text-sm text-slate-500">Completa los datos de la {config.label} del catálogo.</p></div>
    <form onSubmit={submit} className="panel p-5 md:p-8">
      <div className="grid gap-5">
        <div><label className="field-label" htmlFor="entity-name">Nombre<span className="ml-1 text-rose-500">*</span></label><input id="entity-name" value={values.name} onChange={updateValue('name')} className={`field ${nameError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`} aria-invalid={Boolean(nameError)} required minLength={2} />{nameError && <p className="mt-1.5 text-xs text-rose-600">{nameError}</p>}</div>
        {config.description && <>
          <div><label className="field-label" htmlFor="entity-description">Descripción</label><textarea id="entity-description" rows="4" value={values.description} onChange={updateValue('description')} className="field resize-y" /></div>
          <div><label className="field-label" htmlFor="entity-parent">Categoría padre</label><select id="entity-parent" value={values.parent_id} onChange={updateValue('parent_id')} className="field"><option value="">Sin categoría padre</option>{categories.map((category) => <option key={entityId(category)} value={entityId(category)}>{category.name}</option>)}</select></div>
        </>}
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <Link to={`/${config.plural}`} className="btn-secondary"><ArrowLeft size={16} /> Volver a {config.plural === 'brands' ? 'marcas' : 'categorías'}</Link>
        <button type="submit" disabled={submitting} className="btn-primary"><Save size={16} />{submitting ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : `Crear ${config.label}`}</button>
      </div>
    </form>
  </div>
}
