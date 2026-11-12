import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createManagedRecord,
  getManagedRecord,
  listManagedRecords,
  listRoles,
  updateManagedRecord,
} from '../services/managementService'
import { getErrorMessage, logApiError } from '../utils/errorHandler'

export function useUsers({ autoLoad = true } = {}) {
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
      const rows = await listManagedRecords('user')
      if (currentRequest === requestId.current) setRecords(rows)
      return rows
    } catch (cause) {
      if (currentRequest === requestId.current) {
        logApiError(cause, 'cargar usuarios')
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

  const get = useCallback((id) => getManagedRecord('user', id), [])
  const loadRoles = useCallback(() => listRoles(), [])
  const create = useCallback(async (values) => {
    setMutating(true)
    try {
      return await createManagedRecord('user', values)
    } finally {
      setMutating(false)
    }
  }, [])
  const update = useCallback(async (id, values) => {
    setMutating(true)
    try {
      return await updateManagedRecord('user', id, values)
    } finally {
      setMutating(false)
    }
  }, [])

  return { records, loading, error, mutating, refresh, get, loadRoles, create, update }
}
