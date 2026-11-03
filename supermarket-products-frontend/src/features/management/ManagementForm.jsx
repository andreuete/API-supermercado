import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import ErrorState from '../../components/Error'
import { FormSkeleton } from '../../components/Skeleton'
import { createManagedRecord, getManagedRecord, idOf, listProducts, listRoles, updateManagedRecord } from '../../services/managementService'
import { getErrorMessage, logApiError } from '../../utils/errorHandler'
import { notifyError, notifySuccess } from '../../utils/alerts'

const config = {
  variant: { plural: 'variants', label: 'variante', title: 'Variante' },
  user: { plural: 'users', label: 'usuario', title: 'Usuario' },
  role: { plural: 'roles', label: 'rol', title: 'Rol' },
}

const emptyValues = { productId: '', sku: '', price: '', stock: '', attributes: '{}', full_name: '', email: '', password: '', role_ids: [], name: '', permissions: '', is_active: false }

export default function ManagementForm({ entity, mode }) {
  const { productId, sku, id } = useParams()
  const recordId = entity === 'variant' ? { productId, sku } : id
  const { plural, label, title } = config[entity]
  const navigate = useNavigate()
  const [values, setValues] = useState(emptyValues)
  const [products, setProducts] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(mode === 'edit' || entity !== 'role')
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError('')
    const productRequest = entity === 'variant' ? listProducts() : Promise.resolve([])
    const roleRequest = entity === 'user' ? listRoles() : Promise.resolve([])
    const recordRequest = mode === 'edit' ? getManagedRecord(entity, recordId) : Promise.resolve(null)
    Promise.all([productRequest, roleRequest, recordRequest])
      .then(([productRows, roleRows, record]) => {
        if (!active) return
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
      })
      .catch((error) => {
        if (active) {
          logApiError(error, `cargar ${label}`)
          setLoadError(getErrorMessage(error))
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [entity, id, productId, sku, mode, retry, label])

  const setField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setSubmitError('')
  }

  const submit = async (event) => {
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
        payload.sku = values.sku.trim()
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

    if (entity !== 'variant' && entity !== 'user' && payload.name.length < 2) {
      setSubmitError('El nombre debe tener al menos 2 caracteres.')
      return
    }
    if (entity === 'variant' && (!Number.isFinite(payload.price) || payload.price < 0 || !Number.isInteger(payload.stock) || payload.stock < 0)) {
      setSubmitError('El precio debe ser válido y el stock un entero igual o mayor que cero.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'edit') await updateManagedRecord(entity, recordId, payload)
      else await createManagedRecord(entity, payload)
      notifySuccess(mode === 'edit' ? `${title} actualizado` : `${title} creado`)
      navigate(`/${plural}`)
    } catch (error) {
      logApiError(error, `guardar ${label}`)
      setSubmitError(getErrorMessage(error))
      notifyError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl panel"><FormSkeleton /></div>
  if (loadError) return <ErrorState title={`No se pudo cargar el ${label}`} message={loadError} onRetry={() => setRetry((count) => count + 1)} />

  return <div className="mx-auto max-w-3xl">
    <div className="mb-6"><h2 className="text-2xl font-bold">{mode === 'edit' ? `Editar ${label}` : `Crear ${label}`}</h2><p className="mt-1 text-sm text-slate-500">Completa los datos del {label}.</p></div>
    <form onSubmit={submit} className="panel p-5 md:p-8">
      <div className="grid gap-5">
        {entity === 'variant' && <>
          <div><label className="field-label" htmlFor="variant-product">Producto<span className="ml-1 text-rose-500">*</span></label><select id="variant-product" value={values.productId} onChange={setField('productId')} className="field" required disabled={mode === 'edit'}><option value="">Selecciona un producto</option>{products.map((product) => <option key={idOf(product)} value={idOf(product)}>{product.name}</option>)}</select></div>
          <div><label className="field-label" htmlFor="variant-sku">SKU<span className="ml-1 text-rose-500">*</span></label><input id="variant-sku" value={values.sku} onChange={setField('sku')} className="field" required disabled={mode === 'edit'} /></div>
          <div className="grid gap-5 sm:grid-cols-2"><div><label className="field-label" htmlFor="variant-price">Precio (€)<span className="ml-1 text-rose-500">*</span></label><input id="variant-price" type="number" min="0" step="0.01" value={values.price} onChange={setField('price')} className="field" required /></div><div><label className="field-label" htmlFor="variant-stock">Stock<span className="ml-1 text-rose-500">*</span></label><input id="variant-stock" type="number" min="0" step="1" value={values.stock} onChange={setField('stock')} className="field" required /></div></div>
          <div><label className="field-label" htmlFor="variant-attributes">Atributos (JSON)</label><textarea id="variant-attributes" rows="5" value={values.attributes} onChange={setField('attributes')} className="field resize-y font-mono text-xs" /><p className="mt-1.5 text-xs text-slate-400">Por ejemplo: {`{"talla":"L","color":"rojo"}`}</p></div>
        </>}
        {entity === 'user' && <>
          <div><label className="field-label" htmlFor="user-name">Nombre completo<span className="ml-1 text-rose-500">*</span></label><input id="user-name" value={values.full_name} onChange={setField('full_name')} className="field" required minLength={2} /></div>
          <div><label className="field-label" htmlFor="user-email">Correo electrónico<span className="ml-1 text-rose-500">*</span></label><input id="user-email" type="email" autoComplete="email" value={values.email} onChange={setField('email')} className="field" required /></div>
          <div><label className="field-label" htmlFor="user-password">Contraseña{mode === 'create' && <span className="ml-1 text-rose-500">*</span>}</label><input id="user-password" type="password" autoComplete={mode === 'create' ? 'new-password' : 'new-password'} value={values.password} onChange={setField('password')} className="field" minLength={8} required={mode === 'create'} />{mode === 'edit' && <p className="mt-1.5 text-xs text-slate-400">Déjala vacía para conservar la contraseña actual.</p>}</div>
          <fieldset><legend className="field-label">Roles</legend><div className="grid gap-2 sm:grid-cols-2">{roles.map((role) => <label key={idOf(role)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"><input type="checkbox" checked={values.role_ids.includes(idOf(role))} onChange={(event) => setValues((current) => ({ ...current, role_ids: event.target.checked ? [...current.role_ids, idOf(role)] : current.role_ids.filter((roleId) => roleId !== idOf(role)) }))} />{role.name}</label>)}</div>{roles.length === 0 && <p className="text-xs text-slate-500">No hay roles disponibles.</p>}</fieldset>
        </>}
        {entity === 'role' && <>
          <div><label className="field-label" htmlFor="role-name">Nombre<span className="ml-1 text-rose-500">*</span></label><input id="role-name" value={values.name} onChange={setField('name')} className="field" required minLength={2} /></div>
          <div><label className="field-label" htmlFor="role-permissions">Permisos</label><textarea id="role-permissions" rows="6" value={values.permissions} onChange={setField('permissions')} className="field resize-y" /><p className="mt-1.5 text-xs text-slate-400">Introduce un permiso por línea.</p></div>
        </>}
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={values.is_active} onChange={(event) => setValues((current) => ({ ...current, is_active: event.target.checked }))} /> Registro activo</label>
      </div>
      {submitError && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <Link to={`/${plural}`} className="btn-secondary"><ArrowLeft size={16} /> Volver a {plural}</Link>
        <button type="submit" disabled={submitting} className="btn-primary"><Save size={16} />{submitting ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : `Crear ${label}`}</button>
      </div>
    </form>
  </div>
}
