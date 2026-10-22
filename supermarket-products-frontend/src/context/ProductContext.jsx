import { createContext, useCallback, useMemo, useState } from 'react'
import productService from '../services/productService'
import { getErrorMessage, logApiError } from '../utils/errorHandler'

export const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterMode, setFilterMode] = useState('all')

  const refresh = useCallback(async (mode = filterMode) => {
    setLoading(true)
    setError('')
    try {
      const rows = mode === 'active' ? await productService.getActive() : await productService.getAll()
      setProducts(Array.isArray(rows) ? rows : [])
      setFilterMode(mode)
      return rows
    } catch (err) {
      logApiError(err, 'cargar productos')
      setError(getErrorMessage(err))
      throw err
    } finally {
      setLoading(false)
    }
  }, [filterMode])

  const value = useMemo(() => ({
    products, setProducts, loading, error, filterMode, setFilterMode, refresh,
  }), [products, loading, error, filterMode, refresh])

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}