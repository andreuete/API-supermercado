import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { useProducts } from '../hooks/useProducts'

export default function Create() {
  const navigate = useNavigate()
  const { createProduct, mutating } = useProducts({ autoLoad: false })
  const submit = async (values) => {
    await createProduct(values)
    navigate('/')
  }
  return <div className="mx-auto max-w-3xl"><div className="mb-6"><h2 className="text-2xl font-extrabold">Añadir producto</h2><p className="mt-1 text-sm text-slate-500">Registra un nuevo artículo en el inventario.</p></div><ProductForm onSubmit={submit} submitting={mutating} /></div>
}