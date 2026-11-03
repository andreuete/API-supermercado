import { apiRootClient } from './apiClient'

function unwrapList(response, resourceName) {
  const rows = response?.data?.data
  if (!Array.isArray(rows)) {
    throw new Error(`La API no devolvió una lista válida de ${resourceName}.`)
  }
  if (rows.some((item) => typeof item?.name !== 'string')) {
    throw new Error(`La API devolvió ${resourceName} sin nombre.`)
  }
  return rows.filter((item) => !item.deleted_at)
}

const productReferencesService = {
  async getBrands() {
    const response = await apiRootClient.get('/brands')
    return unwrapList(response, 'marcas')
  },
  async getCategories() {
    const response = await apiRootClient.get('/categories')
    return unwrapList(response, 'categorías')
  },
}

export default productReferencesService
