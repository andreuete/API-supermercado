import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productDefaults, productSchema } from '../features/products/schemaEvents'

export default function ProductForm({ initialValues, onSubmit, submitting = false, mode = 'create' }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || productDefaults,
  })
  useEffect(() => { if (initialValues) reset({ ...productDefaults, ...initialValues, precio: Number(initialValues.precio ?? 0), stock: Number(initialValues.stock ?? 0) }) }, [initialValues, reset])
  const fields = [
    { name: 'nombre', label: 'Nombre del producto', placeholder: 'Ej. Leche entera', type: 'text' },
    { name: 'categoria', label: 'Categoría', placeholder: 'Ej. Lácteos, Fruta, Limpieza', type: 'text' },
    { name: 'marca', label: 'Marca', placeholder: 'Nombre de la marca', type: 'text' },
    { name: 'precio', label: 'Precio (€)', placeholder: '0,00', type: 'number', min: 0, step: '0.01' },
    { name: 'stock', label: 'Unidades en stock', placeholder: '0', type: 'number', min: 0, step: '1' },
  ]
  return <form onSubmit={handleSubmit(onSubmit)} className="panel p-5 md:p-8">
    <div className="mb-7 border-b border-slate-100 pb-5"><div className="text-xs font-bold uppercase tracking-[.15em] text-brand">{mode === 'create' ? 'Alta de inventario' : 'Actualizar catálogo'}</div><h2 className="mt-2 text-xl font-extrabold">{mode === 'create' ? 'Información del producto' : 'Editar información'}</h2><p className="mt-1 text-sm text-slate-500">Completa los campos para mantener el catálogo al día.</p></div>
    <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
      {fields.map((field) => <div key={field.name}>
        <label className="field-label" htmlFor={field.name}>{field.label}<span className="ml-1 text-rose-500">*</span></label>
        <input id={field.name} type={field.type} min={field.min} step={field.step} placeholder={field.placeholder} {...register(field.name)} className={`field ${errors[field.name] ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`} aria-invalid={Boolean(errors[field.name])} />
        {errors[field.name] && <p className="mt-1.5 text-xs text-rose-600">{errors[field.name].message}</p>}
      </div>)}
      <div className="md:col-span-2"><label className="field-label" htmlFor="descripcion">Descripción</label><textarea id="descripcion" rows="4" placeholder="Detalles, formato, ingredientes u otra información útil..." {...register('descripcion')} className="field resize-y" /><p className="mt-1.5 text-xs text-slate-400">Campo opcional.</p></div>
    </div>
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
      <Link to="/" className="btn-secondary"><ArrowLeft size={16} /> Volver al inventario</Link>
      <button type="submit" disabled={submitting || isSubmitting} className="btn-primary"><Save size={16} />{submitting || isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}</button>
    </div>
  </form>
}