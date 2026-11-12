import { useEffect, useState } from 'react'
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function ProductImagePreview({ src, alt }) {
  const [previewSrc, setPreviewSrc] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPreviewSrc(src || '')
      setFailed(false)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [src])

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
      {src && previewSrc === src && !failed ? (
        <img
          src={previewSrc}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImagePlus size={20} aria-hidden="true" />
      )}
    </div>
  )
}

export default function ProductForm({
  initialValues,
  brands,
  categories,
  referencesLoading,
  referencesError,
  onRetryReferences,
  register,
  errors,
  isSubmitting,
  imageFields,
  imageValues,
  appendImage,
  removeImage,
  submitForm,
  submitting = false,
  mode = 'create',
}) {
  // Opciones de fallback si initialValues tiene una categoría o marca no listada en activas
  const currentCatId = initialValues?.category?.id || initialValues?.category?._id
  const currentCatName = initialValues?.category?.name
  const catInList = categories.some((c) => String(c._id ?? c.id) === String(currentCatId))

  const currentBrandId = initialValues?.brand?.id || initialValues?.brand?._id
  const currentBrandName = initialValues?.brand?.name
  const brandInList = brands.some((b) => String(b._id ?? b.id) === String(currentBrandId))

  return (
    <form onSubmit={submitForm} className="panel p-5 md:p-8">
      <div className="mb-7 border-b border-slate-100 pb-5">
        <div className="text-xs font-bold tracking-wide text-brand">
          {mode === 'create' ? 'Alta de inventario' : 'Actualizar catálogo'}
        </div>
        <h2 className="mt-2 text-xl font-bold">
          {mode === 'create' ? 'Información del producto' : 'Editar información'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa los campos para sincronizar con el catálogo de MongoDB.
        </p>
      </div>

      {referencesError && (
        <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p>No se pudieron cargar las marcas y categorías: {referencesError}</p>
          <button type="button" onClick={onRetryReferences} className="mt-2 font-semibold underline">
            Reintentar
          </button>
        </div>
      )}

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        {/* Nombre */}
        <div className="md:col-span-2">
          <label className="field-label" htmlFor="name">
            Nombre del producto <span className="ml-1 text-rose-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Ej. Leche entera"
            {...register('name')}
            className={`field ${errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="field-label" htmlFor="categoryId">
            Categoría <span className="ml-1 text-rose-500">*</span>
          </label>
          <select
            id="categoryId"
            disabled={referencesLoading || Boolean(referencesError)}
            {...register('categoryId')}
            className={`field ${errors.categoryId ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`}
            aria-invalid={Boolean(errors.categoryId)}
          >
            <option value="">
              {referencesLoading ? 'Cargando categorías...' : 'Selecciona una categoría'}
            </option>
            {/* Si el valor inicial no está en la lista activa, lo agregamos como opción actual */}
            {currentCatId && currentCatName && !catInList && (
              <option value={String(currentCatId)}>{currentCatName} (Actual)</option>
            )}
            {categories.map((option) => (
              <option key={option._id ?? option.id} value={String(option._id ?? option.id)}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1.5 text-xs text-rose-600">{errors.categoryId.message}</p>}
          {!referencesLoading && !referencesError && categories.length === 0 && (
            <p className="mt-1.5 text-xs text-slate-500">No hay categorías disponibles.</p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label className="field-label" htmlFor="brandId">
            Marca <span className="ml-1 text-rose-500">*</span>
          </label>
          <select
            id="brandId"
            disabled={referencesLoading || Boolean(referencesError)}
            {...register('brandId')}
            className={`field ${errors.brandId ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`}
            aria-invalid={Boolean(errors.brandId)}
          >
            <option value="">
              {referencesLoading ? 'Cargando marcas...' : 'Selecciona una marca'}
            </option>
            {/* Si el valor inicial no está en la lista activa, lo agregamos como opción actual */}
            {currentBrandId && currentBrandName && !brandInList && (
              <option value={String(currentBrandId)}>{currentBrandName} (Actual)</option>
            )}
            {brands.map((option) => (
              <option key={option._id ?? option.id} value={String(option._id ?? option.id)}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.brandId && <p className="mt-1.5 text-xs text-rose-600">{errors.brandId.message}</p>}
          {!referencesLoading && !referencesError && brands.length === 0 && (
            <p className="mt-1.5 text-xs text-slate-500">No hay marcas disponibles.</p>
          )}
        </div>

        {/* Precio */}
        <div>
          <label className="field-label" htmlFor="price">
            Precio (€) <span className="ml-1 text-rose-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            {...register('price')}
            className={`field ${errors.price ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`}
            aria-invalid={Boolean(errors.price)}
          />
          {errors.price && <p className="mt-1.5 text-xs text-rose-600">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="field-label" htmlFor="stock">
            Unidades en stock <span className="ml-1 text-rose-500">*</span>
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            {...register('stock')}
            className={`field ${errors.stock ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`}
            aria-invalid={Boolean(errors.stock)}
          />
          {errors.stock && <p className="mt-1.5 text-xs text-rose-600">{errors.stock.message}</p>}
        </div>

        {/* SKU opcional */}
        <div>
          <label className="field-label" htmlFor="sku">
            Código SKU <span className="text-xs font-normal text-slate-400">(Opcional)</span>
          </label>
          <input
            id="sku"
            type="text"
            placeholder="Ej. LECH-ENT-1L"
            {...register('sku')}
            className="field uppercase"
          />
          <p className="mt-1 text-xs text-slate-400">Si se deja vacío, se generará uno automáticamente.</p>
        </div>

        {/* Estado */}
        <div>
          <label className="field-label" htmlFor="status">
            Estado de publicación
          </label>
          <select id="status" {...register('status')} className="field">
            <option value="published">Publicado (activo)</option>
            <option value="draft">Borrador (draft)</option>
            <option value="inactive">Inactivo (inactive)</option>
            <option value="archived">Archivado (archived)</option>
          </select>
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="field-label" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            rows="3"
            placeholder="Detalles, características, ingredientes u otra información útil..."
            {...register('description')}
            className="field resize-y"
          />
          <p className="mt-1.5 text-xs text-slate-400">Descripción detallada del producto.</p>
        </div>

        {/* Imágenes */}
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <span className="field-label">Imágenes del producto</span>
              <p className="text-xs text-slate-400">Añade una o varias URL de imágenes. No se suben archivos.</p>
            </div>
            <button
              type="button"
              onClick={() => appendImage({ url: '' })}
              className="btn-secondary shrink-0"
            >
              <ImagePlus size={16} /> Añadir URL
            </button>
          </div>

          {imageFields.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500">
              Aún no has añadido imágenes.
            </p>
          ) : (
            <div className="space-y-3">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <ProductImagePreview
                    src={imageValues[index]?.url?.trim()}
                    alt={`Vista previa de imagen ${index + 1}`}
                  />
                  <div className="min-w-0 flex-1">
                    <label className="sr-only" htmlFor={`images.${index}.url`}>
                      URL de la imagen {index + 1}
                    </label>
                    <input
                      id={`images.${index}.url`}
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...register(`images.${index}.url`)}
                      className={`field ${errors.images?.[index]?.url ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-50' : ''}`}
                      aria-invalid={Boolean(errors.images?.[index]?.url)}
                    />
                    {errors.images?.[index]?.url && (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.images[index].url.message}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn-secondary shrink-0 p-3 text-rose-600"
                    aria-label={`Eliminar URL de imagen ${index + 1}`}
                    title="Eliminar imagen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <Link to="/" className="btn-secondary">
          <ArrowLeft size={16} /> Volver al inventario
        </Link>
        <button
          type="submit"
          disabled={submitting || isSubmitting || referencesLoading}
          className="btn-primary"
        >
          <Save size={16} />
          {submitting || isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
