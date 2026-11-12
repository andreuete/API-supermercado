import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import productReferencesService from '../services/productReferencesService'
import { productDefaults, productSchema } from '../features/products/schemaEvents'
import { getErrorMessage, logApiError } from '../utils/errorHandler'

export function getInitialFormValues(product, categories = [], brands = []) {
  if (!product) return productDefaults

  const variants = Array.isArray(product.variants) ? product.variants : []
  const prices = variants.map((variant) => Number(variant.price)).filter(Number.isFinite)
  const variantStock = variants.reduce((total, variant) => total + Number(variant.stock || 0), 0)
  const firstVariant = variants[0]
  const rawCatId = product.category?.id || product.category?._id || (typeof product.category === 'string' ? product.category : '')
  const rawCatName = product.category?.name || product.categoria || ''
  const matchedCategory = categories.find(
    (category) => String(category._id ?? category.id) === String(rawCatId)
      || category.name === rawCatName
      || category.slug === rawCatName,
  )
  const categoryId = matchedCategory ? String(matchedCategory._id ?? matchedCategory.id) : String(rawCatId || '')
  const rawBrandId = product.brand?.id || product.brand?._id || (typeof product.brand === 'string' ? product.brand : '')
  const rawBrandName = product.brand?.name || product.marca || ''
  const matchedBrand = brands.find(
    (brand) => String(brand._id ?? brand.id) === String(rawBrandId)
      || brand.name === rawBrandName
      || brand.slug === rawBrandName,
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

function buildProductPayload(values, { initialValues, mode, categories, brands }) {
  const selectedCategory = categories.find(
    (category) => String(category._id ?? category.id) === String(values.categoryId)
      || category.name === values.categoryId,
  )
  const selectedBrand = brands.find(
    (brand) => String(brand._id ?? brand.id) === String(values.brandId)
      || brand.name === values.brandId,
  )

  if (!selectedCategory) throw new Error('La categoría seleccionada no es válida.')
  if (!selectedBrand) throw new Error('La marca seleccionada no es válida.')

  let variants
  if (mode === 'edit' && Array.isArray(initialValues?.variants) && initialValues.variants.length > 0) {
    variants = initialValues.variants.map((variant, index) => index === 0
      ? {
        ...variant,
        price: Number(values.price),
        stock: Number(values.stock),
        sku: values.sku?.trim() || variant.sku,
      }
      : variant)
  } else {
    variants = [{
      sku: values.sku?.trim() || undefined,
      price: Number(values.price),
      stock: Number(values.stock),
      attributes: {},
      is_active: values.is_active ?? true,
      status: values.status || 'published',
    }]
  }

  return {
    name: values.name.trim(),
    description: values.description?.trim() || '',
    category: {
      id: selectedCategory._id ?? selectedCategory.id,
      slug: selectedCategory.slug,
      name: selectedCategory.name,
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
}

export function useProductForm({ initialValues, mode, save }) {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [referencesLoading, setReferencesLoading] = useState(true)
  const [referencesError, setReferencesError] = useState('')
  const requestId = useRef(0)

  const loadReferences = useCallback(async () => {
    const currentRequest = ++requestId.current
    setReferencesLoading(true)
    setReferencesError('')
    try {
      const [brandRows, categoryRows] = await Promise.all([
        productReferencesService.getBrands(),
        productReferencesService.getCategories(),
      ])
      if (currentRequest === requestId.current) {
        setBrands(brandRows)
        setCategories(categoryRows)
      }
    } catch (error) {
      if (currentRequest === requestId.current) {
        logApiError(error, 'cargar marcas y categorías')
        setReferencesError(getErrorMessage(error))
      }
    } finally {
      if (currentRequest === requestId.current) setReferencesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReferences()
    return () => { requestId.current += 1 }
  }, [loadReferences])

  const onSubmit = useCallback(async (values) => {
    const payload = buildProductPayload(values, { initialValues, mode, categories, brands })
    await save(payload)
  }, [initialValues, mode, categories, brands, save])
  const formValues = useMemo(
    () => referencesLoading ? null : getInitialFormValues(initialValues, categories, brands),
    [initialValues, categories, brands, referencesLoading],
  )
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: formValues || productDefaults,
  })
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: 'images',
  })
  const imageValues = useWatch({ control: form.control, name: 'images' }) || []

  useEffect(() => {
    if (formValues) form.reset(formValues)
  }, [formValues, form.reset])
  const submitForm = form.handleSubmit(onSubmit)

  return {
    brands,
    categories,
    referencesLoading,
    referencesError,
    onRetryReferences: loadReferences,
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    imageFields,
    imageValues,
    appendImage,
    removeImage,
    submitForm,
  }
}
