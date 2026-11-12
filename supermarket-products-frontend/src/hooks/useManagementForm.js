import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage, logApiError } from '../utils/errorHandler'
import { notifyError, notifySuccess } from '../utils/alerts'

const config = {
  variant: { plural: 'variants', label: 'variante', title: 'Variante' },
  user: { plural: 'users', label: 'usuario', title: 'Usuario' },
  role: { plural: 'roles', label: 'rol', title: 'Rol' },
}

const emptyValues = {
  productId: '',
  sku: '',
  price: '',
  stock: '',
  attributes: '{}',
  full_name: '',
  email: '',
  password: '',
  role_ids: [],
  name: '',
  permissions: '',
  is_active: false,
}

export function useManagementForm(entity, mode, management) {
  const { productId, sku, id } = useParams()
  const recordId = useMemo(
    () => entity === 'variant' ? { productId, sku } : id,
    [entity, id, productId, sku],
  )
  const navigate = useNavigate()
  const { get, loadProducts, loadRoles, create, update, mutating } = management
  const [values, setValues] = useState(emptyValues)
  const [products, setProducts] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(mode === 'edit' || entity !== 'role')
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [retry, setRetry] = useState(0)
  const requestIdRef = useRef(0)
  const entityConfig = config[entity]

  const load = useCallback(async () => {
    const currentRequest = ++requestIdRef.current
    setLoading(true)
    setLoadError('')
    try {
      const [productRows, roleRows, record] = await Promise.all([
        entity === 'variant' ? loadProducts() : Promise.resolve([]),
        entity === 'user' ? loadRoles() : Promise.resolve([]),
        mode === 'edit' ? get(recordId) : Promise.resolve(null),
      ])
      if (currentRequest !== requestIdRef.current) return
      setProducts(productRows)
      setRoles(roleRows)
      if (!record) return
      if (entity === 'variant') {
        setValues({
          ...emptyValues,
          productId: record.productId,
          sku: record.sku,
          price: String(record.price ?? ''),
          stock: String(record.stock ?? ''),
          attributes: JSON.stringify(record.attributes || {}, null, 2),
          is_active: Boolean(record.is_active),
        })
      } else if (entity === 'user') {
        setValues({
          ...emptyValues,
          full_name: record.full_name || '',
          email: record.email || '',
          role_ids: (record.role_ids || []).map((role) => String(role.id ?? role._id ?? role)),
          is_active: Boolean(record.is_active),
        })
      } else {
        setValues({
          ...emptyValues,
          name: record.name || '',
          permissions: (record.permissions || []).join('\n'),
          is_active: Boolean(record.is_active),
        })
      }
    } catch (error) {
      if (currentRequest === requestIdRef.current) {
        logApiError(error, `cargar ${entityConfig.label}`)
        setLoadError(getErrorMessage(error))
      }
    } finally {
      if (currentRequest === requestIdRef.current) setLoading(false)
    }
  }, [entity, entityConfig.label, get, loadProducts, loadRoles, mode, recordId])

  useEffect(() => {
    load()
    return () => { requestIdRef.current += 1 }
  }, [load, retry])

  const onFieldChange = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setSubmitError('')
  }, [])

  const onRoleChange = useCallback((roleId, checked) => {
    setValues((current) => ({
      ...current,
      role_ids: checked
        ? [...current.role_ids, roleId]
        : current.role_ids.filter((currentRoleId) => currentRoleId !== roleId),
    }))
  }, [])

  const onSubmit = useCallback(async (event) => {
    event.preventDefault()
    setSubmitError('')
    let payload
    if (entity === 'variant') {
      let attributes
      try {
        attributes = JSON.parse(values.attributes || '{}')
      } catch {
        setSubmitError('Los atributos deben ser un objeto JSON válido.')
        return
      }
      if (!attributes || Array.isArray(attributes) || typeof attributes !== 'object') {
        setSubmitError('Los atributos deben ser un objeto JSON.')
        return
      }
      payload = {
        price: Number(values.price),
        stock: Number(values.stock),
        attributes,
        is_active: values.is_active,
      }
      if (mode === 'create') {
        if (values.sku.trim()) payload.sku = values.sku.trim()
        payload.productId = values.productId
      }
    } else if (entity === 'user') {
      payload = {
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        role_ids: values.role_ids,
        is_active: values.is_active,
      }
      if (values.password) payload.password = values.password
      if (mode === 'create' && values.password.length < 8) {
        setSubmitError('La contraseña debe tener al menos 8 caracteres.')
        return
      }
    } else {
      payload = {
        name: values.name.trim(),
        permissions: values.permissions.split('\n').map((permission) => permission.trim()).filter(Boolean),
        is_active: values.is_active,
      }
    }

    if (entity === 'role' && payload.name.length < 2) {
      setSubmitError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    if (entity === 'variant' && (!Number.isFinite(payload.price) || payload.price < 0 || !Number.isInteger(payload.stock) || payload.stock < 0)) {
      setSubmitError('El precio debe ser válido y el stock un entero igual o mayor que cero.')
      return
    }

    try {
      if (mode === 'edit') await update(recordId, payload)
      else await create(payload)
      notifySuccess(mode === 'edit' ? `${entityConfig.title} actualizado` : `${entityConfig.title} creado`)
      navigate(`/${entityConfig.plural}`)
    } catch (error) {
      logApiError(error, `guardar ${entityConfig.label}`)
      setSubmitError(getErrorMessage(error))
      notifyError(getErrorMessage(error))
    }
  }, [create, entity, entityConfig, mode, navigate, recordId, update, values])

  return {
    values,
    products,
    roles,
    loading,
    loadError,
    submitError,
    mutating,
    onRetry: () => setRetry((count) => count + 1),
    onFieldChange,
    onRoleChange,
    onSubmit,
  }
}
