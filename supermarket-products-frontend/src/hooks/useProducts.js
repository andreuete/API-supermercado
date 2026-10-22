import { useCallback, useContext, useEffect, useState } from 'react'
import { ProductContext } from '../context/ProductContext'
import productService from '../services/productService'
import { getErrorMessage, logApiError } from '../utils/errorHandler'
import { notifyError, notifySuccess } from '../utils/alerts'

export function useProducts({ autoLoad = true } = {}) {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts debe usarse dentro de ProductProvider')
  const [mutating, setMutating] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    if (autoLoad && context.products.length === 0 && !context.error) {
      context.refresh().catch(() => {})
    }
  }, [autoLoad]) // carga inicial intencional; evita refrescar en cada render

  const runMutation = useCallback(async (operation, successMessage, refresh = true) => {
    setMutating(true)
    try {
      const result = await operation()
      if (refresh) await context.refresh()
      notifySuccess(successMessage)
      return result
    } catch (error) {
      logApiError(error, successMessage)
      notifyError(getErrorMessage(error))
      throw error
    } finally {
      setMutating(false)
    }
  }, [context.refresh])

  const createProduct = (payload) => runMutation(() => productService.create(payload), 'Producto creado correctamente.')
  const updateProduct = (id, payload) => runMutation(() => productService.update(id, payload), 'Producto actualizado correctamente.')
  const deleteProduct = (id) => runMutation(() => productService.remove(id), 'Producto eliminado definitivamente.')
  const softDeleteProduct = (id) => runMutation(() => productService.softDelete(id), 'Producto enviado a la papelera.')
  const restoreProduct = (id) => runMutation(() => productService.restore(id), 'Producto restaurado.')
  const changeStatus = (id, status) => runMutation(() => productService.updateStatus(id, status), 'Estado actualizado.')
  const toggleActive = (id, isActive) => runMutation(() => productService.toggleActive(id, isActive), 'Visibilidad actualizada.')

  const getProduct = useCallback(async (id) => {
    setMutating(true)
    try {
      const product = await productService.getById(id)
      setSelectedProduct(product?.product ?? product)
      return product?.product ?? product
    } catch (error) {
      logApiError(error, 'obtener producto')
      notifyError(getErrorMessage(error))
      throw error
    } finally {
      setMutating(false)
    }
  }, [])

  return {
    ...context, mutating, selectedProduct, setSelectedProduct, getProduct,
    createProduct, updateProduct, deleteProduct, softDeleteProduct, restoreProduct, changeStatus, toggleActive,
    refresh: context.refresh,
  }
}