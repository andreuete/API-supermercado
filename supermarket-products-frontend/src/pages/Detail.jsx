import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetail from '../components/ProductDetail'
import { FormSkeleton } from '../components/Skeleton'
import ErrorState from '../components/Error'
import { useProducts } from '../hooks/useProducts'

export default function Detail() {
  const { id } = useParams()
  const { getProduct } = useProducts({ autoLoad: false })
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    getProduct(id).then((p) => { if (alive) setProduct(p) }).catch((e) => { if (alive) setError(e?.response?.data?.message || 'No se pudo cargar el producto.') }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [id])
  if (loading) return <div className="panel"><FormSkeleton /></div>
  if (error || !product) return <ErrorState title="Producto no disponible" message={error || 'No se encontró el producto.'} onRetry={() => window.location.reload()} />
  return <ProductDetail product={product} />
}