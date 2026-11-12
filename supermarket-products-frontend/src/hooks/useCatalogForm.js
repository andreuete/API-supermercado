import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { entityId } from '../services/entityService'
import { getErrorMessage, logApiError } from '../utils/errorHandler'
import { notifyError, notifySuccess } from '../utils/alerts'

const config = {
  brand: { plural: 'brands', label: 'marca', title: 'Marca', hasDescription: false },
  category: { plural: 'categories', label: 'categoría', title: 'Categoría', hasDescription: true },
}

export function useCatalogForm(entity, mode, catalog) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get, list, create, update, mutating } = catalog
  const [values, setValues] = useState({ name: '', description: '', parent_id: '' })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(mode === 'edit' || entity === 'category')
  const [loadError, setLoadError] = useState('')
  const [nameError, setNameError] = useState('')
  const [retry, setRetry] = useState(0)
  const requestId = useRef(0)
  const entityConfig = config[entity]

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoadError('')
    setLoading(true)
    try {
      const [record, categoryRows] = await Promise.all([
        mode === 'edit' ? get(id) : Promise.resolve(null),
        entity === 'category' ? list() : Promise.resolve([]),
      ])
      if (currentRequest === requestId.current && record) {
        setValues({
          name: record.name || '',
          description: record.description || '',
          parent_id: record.parent_id?.id ?? record.parent_id?._id ?? record.parent_id ?? '',
        })
      }
      if (currentRequest === requestId.current) {
        setCategories(categoryRows.filter((category) => String(entityId(category)) !== String(id)))
      }
    } catch (error) {
      if (currentRequest === requestId.current) {
        logApiError(error, `cargar ${entityConfig.label}`)
        setLoadError(getErrorMessage(error))
      }
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [entity, entityConfig.label, get, id, list, mode])

  useEffect(() => {
    load()
    return () => { requestId.current += 1 }
  }, [load, retry])

  const onChange = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (field === 'name') setNameError('')
  }, [])

  const onSubmit = useCallback(async (event) => {
    event.preventDefault()
    const name = values.name.trim()
    if (name.length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    const payload = entityConfig.hasDescription
      ? { name, description: values.description.trim(), parent_id: values.parent_id || null }
      : { name }
    try {
      if (mode === 'edit') await update(id, payload)
      else await create(payload)
      notifySuccess(mode === 'edit' ? `${entityConfig.title} actualizada` : `${entityConfig.title} creada`)
      navigate(`/${entityConfig.plural}`)
    } catch (error) {
      logApiError(error, `guardar ${entityConfig.label}`)
      notifyError(getErrorMessage(error))
    }
  }, [create, entityConfig, id, mode, navigate, update, values])

  return {
    id,
    values,
    categories,
    loading,
    loadError,
    nameError,
    mutating,
    config: entityConfig,
    onChange,
    onSubmit,
    onRetry: () => setRetry((count) => count + 1),
  }
}
