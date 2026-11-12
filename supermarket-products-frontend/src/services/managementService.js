import { apiRootClient } from './apiClient'
import productService from './productService'
import { idOf } from '../utils/recordIds'

const paths = { user: '/users', role: '/roles' }
const unwrap = (response) => response?.data?.data
export async function listManagedRecords(entity) {
  if (entity === 'variant') {
    const products = await productService.getAll()
    return products.flatMap((product) => (product.variants || [])
      .filter((variant) => !variant.deleted_at)
      .map((variant) => ({ ...variant, productId: idOf(product), productName: product.name })))
  }
  const response = await apiRootClient.get(paths[entity])
  const records = unwrap(response)
  if (!Array.isArray(records)) throw new Error('La API no devolvió una lista válida.')
  return records.filter((record) => !record.deleted_at)
}

export async function listProducts() {
  return productService.getAll()
}

export async function listRoles() {
  const response = await apiRootClient.get(paths.role)
  const records = unwrap(response)
  if (!Array.isArray(records)) throw new Error('La API no devolvió una lista válida de roles.')
  return records.filter((record) => !record.deleted_at)
}

export async function getManagedRecord(entity, id) {
  if (entity === 'variant') {
    const response = await productService.getById(id.productId)
    const product = response?.product ?? response
    const variant = product.variants?.find((item) => item.sku === id.sku)
    if (!variant) throw new Error('No se encontró la variante solicitada.')
    return { ...variant, productId: idOf(product), productName: product.name }
  }
  const response = await apiRootClient.get(`${paths[entity]}/${encodeURIComponent(id)}`)
  const record = unwrap(response)
  if (!record) throw new Error('No se encontró el registro solicitado.')
  return record
}

export async function createManagedRecord(entity, values) {
  if (entity === 'variant') {
    const { productId, ...payload } = values
    const response = await apiRootClient.post(`/products/${encodeURIComponent(productId)}/variants`, payload)
    return unwrap(response)
  }
  const response = await apiRootClient.post(paths[entity], values)
  return unwrap(response)
}

export async function updateManagedRecord(entity, id, values) {
  if (entity === 'variant') {
    const { productId, sku } = id
    const response = await apiRootClient.put(
      `/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(sku)}`,
      values,
    )
    return unwrap(response)
  }
  const response = await apiRootClient.put(`${paths[entity]}/${encodeURIComponent(id)}`, values)
  return unwrap(response)
}

export { idOf }
