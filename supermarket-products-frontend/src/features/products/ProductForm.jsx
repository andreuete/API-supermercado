import { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ImagePlus, Save, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productDefaults, productSchema } from './schemaEvents'
import productReferencesService from '../../services/productReferencesService'
import { getErrorMessage, logApiError } from '../../utils/errorHandler'

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

function getInitialFormValues(product, categories = [], brands = []) {
  if (!product) return productDefaults

  const variants = Array.isArray(product.variants) ? product.variants : []
  const prices = variants.map((variant) => Number(variant.price)).filter(Number.isFinite)
  const variantStock = variants.reduce((total, variant) => total + Number(variant.stock || 0), 0)
  const firstVariant = variants[0]

  // Resolver ID de categoría (por id, _id o nombre)
  const rawCatId = product.category?.id || product.category?._id || (typeof product.category === 'string' ? product.category : '')
  const rawCatName = product.category?.name || product.categoria || ''
  const matchedCategory = categories.find(
    (c) => String(c._id ?? c.id) === String(rawCatId) || c.name === rawCatName || c.slug === rawCatName
  )
  const categoryId = matchedCategory ? String(matchedCategory._id ?? matchedCategory.id) : String(rawCatId || '')

  // Resolver ID de marca (por id, _id o nombre)
  const rawBrandId = product.brand?.id || product.brand?._id || (typeof product.brand === 'string' ? product.brand : '')
  const rawBrandName = product.brand?.name || product.marca || ''
  const matchedBrand = brands.find(
    (b) => String(b._id ?? b.id) === String(rawBrandId) || b.name === rawBrandName || b.slug === rawBrandName
  )
  const brandId = matchedBrand ? String(matchedBrand._id ?? matchedBrand.id) : String(rawBrandId || '')

  return {
    name: product.name ?? product.nombre ?? '',
    categoryId,
    brandId,
    price: Number(firstVariant?.price ?? (prices.length ? Math.min(...prices) : (product.price ?? product.precio ?? 0))),
    stock: Number(firstVariant?.stock ?? (product.stock ?? variantStock)),
    description: product.description ?? product.descripcion ?? '',
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({ url: typeof image === 'string' ? image : image?.url || '' }))
      : [],
    sku: firstVariant?.sku || '',
    is_active: product.is_active ?? product.isActive ?? true,
    status: product.status || 'published',
  }
}

export default function ProductForm({ initialValues, onSubmit, submitting = false, mode = 'create' }) {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [referencesLoading, setReferencesLoading] = useState(true)
  const [referencesError, setReferencesError] = useState('')

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: getInitialFormValues(initialValues, [], []),
  })
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  })
  const imageValues = useWatch({ control, name: 'images' }) || []

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

  // Sincronizar el formulario una vez que las opciones asíncronas estén en el DOM
  useEffect(() => {
    if (!referencesLoading) {
      if (initialValues) {
        reset(getInitialFormValues(initialValues, categories, brands))
      } else {
        reset(productDefaults)
      }
    }
  }, [initialValues, referencesLoading, categories, brands, reset])

  const handleFormSubmit = async (values) => {
    const selectedCat = categories.find(
      (c) => String(c._id ?? c.id) === String(values.categoryId) || c.name === values.categoryId
    )
    const selectedBrand = brands.find(
      (b) => String(b._id ?? b.id) === String(values.brandId) || b.name === values.brandId
    )

    if (!selectedCat) {
      throw new Error('La categoría seleccionada no es válida.')
    }
    if (!selectedBrand) {
      throw new Error('La marca seleccionada no es válida.')
    }

    // Gestionar variantes compatibles con el backend
    let variants = []
    if (mode === 'edit' && Array.isArray(initialValues?.variants) && initialValues.variants.length > 0) {
      variants = initialValues.variants.map((v, index) => {
        if (index === 0) {
          return {
            ...v,
            price: Number(values.price),
            stock: Number(values.stock),
            sku: values.sku?.trim() || v.sku,
          }
        }
        return v
      })
    } else {
      const catPrefix = selectedCat.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'PRD'
      const namePrefix = values.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'ITEM'
      const autoSku = values.sku?.trim() || `${catPrefix}-${namePrefix}-${Date.now().toString().slice(-4)}`
      variants = [
        {
          sku: autoSku,
          price: Number(values.price),
          stock: Number(values.stock),
          attributes: {},
          is_active: values.is_active ?? true,
          status: values.status || 'published',
        }
      ]
    }

    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() || '',
      category: {
        id: selectedCat._id ?? selectedCat.id,
        slug: selectedCat.slug,
        name: selectedCat.name,
      },
      brand: {
        id: selectedBrand._id ?? selectedBrand.id,
        slug: selectedBrand.slug,
        name: selectedBrand.name,
      },
      variants,
      images: values.images.map(({ url }) => {
        const existingImage = Array.isArray(initialValues?.images)
          ? initialValues.images.find((image) => image?.url === url)
          : null
        return { url: url.trim(), alt_text: existingImage?.alt_text || '' }
      }),
      is_active: values.is_active ?? true,
      status: values.status || 'published',
    }

    await onSubmit(payload)
  }

  // Opciones de fallback si initialValues tiene una categoría o marca no listada en activas
  const currentCatId = initialValues?.category?.id || initialValues?.category?._id
  const currentCatName = initialValues?.category?.name
  const catInList = categories.some((c) => String(c._id ?? c.id) === String(currentCatId))

  const currentBrandId = initialValues?.brand?.id || initialValues?.brand?._id
  const currentBrandName = initialValues?.brand?.name
  const brandInList = brands.some((b) => String(b._id ?? b.id) === String(currentBrandId))

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="panel p-5 md:p-8">
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
          <button type="button" onClick={loadReferences} className="mt-2 font-semibold underline">
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
