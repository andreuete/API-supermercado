import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { FormSkeleton } from '../components/Skeleton'
import ErrorState from '../components/Error'
import { useProducts } from '../hooks/useProducts'

export default function Edit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, updateProduct, mutating } = useProducts({ autoLoad: false })
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    getProduct(id).then((data) => { if (alive) setProduct(data) }).catch((e) => { if (alive) setError(e?.response?.data?.message || 'No se pudo cargar el producto.') }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [id])
  const submit = async (values) => { await updateProduct(id, values); navigate('/') }
  if (loading) return <div className="mx-auto max-w-3xl panel"><FormSkeleton /></div>
  if (error || !product) return <ErrorState title="No se pudo abrir el producto" message={error || 'El producto no existe.'} onRetry={() => window.location.reload()} />
  return <div className="mx-auto max-w-3xl"><div className="mb-6"><h2 className="text-2xl font-extrabold">Editar producto</h2><p className="mt-1 text-sm text-slate-500">Modifica los datos de {product.nombre}.</p></div><ProductForm initialValues={product} mode="edit" onSubmit={submit} submitting={mutating} /></div>
}