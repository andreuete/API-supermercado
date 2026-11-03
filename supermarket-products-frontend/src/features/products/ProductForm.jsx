import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productDefaults, productSchema } from './schemaEvents'
import productReferencesService from '../../services/productReferencesService'
import { getErrorMessage, logApiError } from '../../utils/errorHandler'

function getReferenceName(reference) {
  if (typeof reference === 'string') return reference
  return reference?.name || ''
}

function getInitialFormValues(product) {
  const variants = Array.isArray(product.variants) ? product.variants : []
  const prices = variants.map((variant) => Number(variant.price)).filter(Number.isFinite)
  const variantStock = variants.reduce((total, variant) => total + Number(variant.stock || 0), 0)

  return {
    ...productDefaults,
    nombre: product.nombre ?? product.name ?? '',
    categoria: getReferenceName(product.categoria ?? product.category),
    marca: getReferenceName(product.marca ?? product.brand),
    precio: Number(product.precio ?? product.price ?? (prices.length ? Math.min(...prices) : 0)),
    stock: Number(product.stock ?? variantStock),
    descripcion: product.descripcion ?? product.description ?? '',
  }
}

export default function ProductForm({ initialValues, onSubmit, submitting = false, mode = 'create' }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || productDefaults,
  })
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [referencesLoading, setReferencesLoading] = useState(true)
  const [referencesError, setReferencesError] = useState('')

  useEffect(() => {
    if (initialValues) reset(getInitialFormValues(initialValues))
  }, [initialValues, reset])

  const loadReferences = useCallback(async () => {
    setReferencesLoading(true)
    setReferencesError('')
    try {
      const [brandRows, categoryRows] = await Promise.all([
        productReferencesService.getBrands(),
        productReferencesService.getCategories(),
      ])
      setBrands(brandRows)
      setCategories(categoryRows)
    } catch (error) {
      logApiError(error, 'cargar marcas y categorías')
      setReferencesError(getErrorMessage(error))
    } finally {
      setReferencesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReferences()
  }, [loadReferences])

  const fields = [
    { name: 'nombre', label: 'Nombre del producto', placeholder: 'Ej. Leche entera', type: 'text' },
    { name: 'categoria', label: 'Categoría', placeholder: 'Selecciona una categoría', type: 'select', options: categories },
    { name: 'marca', label: 'Marca', placeholder: 'Selecciona una marca', type: 'select', options: brands },
    { name: 'precio', label: 'Precio (€)', placeholder: '0,00', type: 'number', min: 0, step: '0.01' },
    { name: 'stock', label: 'Unidades en stock', placeholder: '0', type: 'number', min: 0, step: '1' },
  ]
  return <form onSubmit={handleSubmit(onSubmit)} className="panel p-5 md:p-8">
    <div className="mb-7 border-b border-slate-100 pb-5"><div className="text-xs font-bold tracking-wide text-brand">{mode === 'create' ? 'Alta de inventario' : 'Actualizar catálogo'}</div><h2 className="mt-2 text-xl font-bold">{mode === 'create' ? 'Información del producto' : 'Editar información'}</h2><p className="mt-1 text-sm text-slate-500">Completa los campos para mantener el catálogo al día.</p></div>
    {referencesError && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <p>No se pudieron cargar las marcas y categorías: {referencesError}</p>
      <button type="button" onClick={loadReferences} className="mt-2 font-semibold underline">Reintentar</button>
    </div>}
    <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
      {fields.map((field) => <div key={field.name}>
        <label className="field-label" htmlFor={field.name}>{field.label}<span className="ml-1 text-rose-500">*</span></label>
        {field.type === 'select' ? <select id={field.name} disabled={referencesLoading || Boolean(referencesError)} {...register(field.name)} className={`field ${errors[field.name] ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`} aria-invalid={Boolean(errors[field.name])}>
          <option value="">{referencesLoading ? 'Cargando opciones...' : field.placeholder}</option>
          {field.options.map((option) => <option key={option._id ?? option.id ?? option.name} value={option.name}>{option.name}</option>)}
        </select> : <input id={field.name} type={field.type} min={field.min} step={field.step} placeholder={field.placeholder} {...register(field.name)} className={`field ${errors[field.name] ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`} aria-invalid={Boolean(errors[field.name])} />}
        {errors[field.name] && <p className="mt-1.5 text-xs text-rose-600">{errors[field.name].message}</p>}
        {field.type === 'select' && !referencesLoading && !referencesError && field.options.length === 0 && <p className="mt-1.5 text-xs text-slate-500">No hay {field.name === 'marca' ? 'marcas' : 'categorías'} disponibles.</p>}
      </div>)}
      <div className="md:col-span-2"><label className="field-label" htmlFor="descripcion">Descripción</label><textarea id="descripcion" rows="4" placeholder="Detalles, formato, ingredientes u otra información útil..." {...register('descripcion')} className="field resize-y" /><p className="mt-1.5 text-xs text-slate-400">Campo opcional.</p></div>
    </div>
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
      <Link to="/" className="btn-secondary"><ArrowLeft size={16} /> Volver al inventario</Link>
      <button type="submit" disabled={submitting || isSubmitting} className="btn-primary"><Save size={16} />{submitting || isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}</button>
    </div>
  </form>
}