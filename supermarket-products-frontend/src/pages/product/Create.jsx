import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../../features/products/ProductForm'
import { useProducts } from '../../hooks/useProducts'
import { useProductForm } from '../../hooks/useProductForm'

export default function Create() {
  const navigate = useNavigate()
  const { createProduct, mutating } = useProducts({ autoLoad: false })

  const save = useCallback(async (payload) => {
    await createProduct(payload)
    navigate('/')
  }, [createProduct, navigate])
  const form = useProductForm({ mode: 'create', save })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Añadir producto</h2>
        <p className="mt-1 text-sm text-slate-500">Registra un nuevo artículo en el catálogo.</p>
      </div>
      <ProductForm {...form} submitting={mutating} mode="create" />
    </div>
  )
}
