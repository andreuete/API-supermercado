import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createManagedRecord,
  getManagedRecord,
  listManagedRecords,
  listProducts,
  updateManagedRecord,
} from '../services/managementService'
import { getErrorMessage, logApiError } from '../utils/errorHandler'

export function useVariants({ autoLoad = true } = {}) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(autoLoad)
  const [error, setError] = useState('')
  const [mutating, setMutating] = useState(false)
  const requestId = useRef(0)

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError('')
    try {
      const rows = await listManagedRecords('variant')
      if (currentRequest === requestId.current) setRecords(rows)
      return rows
    } catch (cause) {
      if (currentRequest === requestId.current) {
        logApiError(cause, 'cargar variantes')
        setError(getErrorMessage(cause))
      }
      throw cause
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoLoad) refresh().catch(() => {})
    return () => { requestId.current += 1 }
  }, [autoLoad, refresh])

  const get = useCallback((id) => getManagedRecord('variant', id), [])
  const loadProducts = useCallback(() => listProducts(), [])
  const create = useCallback(async (values) => {
    setMutating(true)
    try {
      return await createManagedRecord('variant', values)
    } finally {
      setMutating(false)
    }
  }, [])
  const update = useCallback(async (id, values) => {
    setMutating(true)
    try {
      return await updateManagedRecord('variant', id, values)
    } finally {
      setMutating(false)
    }
  }, [])

  return { records, loading, error, mutating, refresh, get, loadProducts, create, update }
}
