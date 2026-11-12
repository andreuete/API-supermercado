import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createEntity,
  getEntity,
  listEntities,
  updateEntity,
} from '../services/entityService'
import { getErrorMessage, logApiError } from '../utils/errorHandler'

export function useCatalogEntities(entity, { autoLoad = true } = {}) {
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(autoLoad)
  const [error, setError] = useState('')
  const [mutating, setMutating] = useState(false)
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError('')
    try {
      const rows = await listEntities(entity)
      if (currentRequest === requestId.current) setEntities(rows)
      return rows
    } catch (cause) {
      if (currentRequest === requestId.current) {
        logApiError(cause, `cargar ${entity}`)
        setError(getErrorMessage(cause))
      }
      throw cause
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [entity])

  useEffect(() => {
    if (autoLoad) refresh().catch(() => {})
    return () => { requestId.current += 1 }
  }, [autoLoad, refresh])

  const get = useCallback((id) => getEntity(entity, id), [entity])
  const list = useCallback(() => listEntities(entity), [entity])

  const runMutation = useCallback(async (operation) => {
    setMutating(true)
    try {
      return await operation()
    } finally {
      setMutating(false)
    }
  }, [])

  const create = useCallback(
    (values) => runMutation(() => createEntity(entity, values)),
    [entity, runMutation],
  )
  const update = useCallback(
    (id, values) => runMutation(() => updateEntity(entity, id, values)),
    [entity, runMutation],
  )

  return { entities, loading, error, mutating, refresh, get, list, create, update }
}
