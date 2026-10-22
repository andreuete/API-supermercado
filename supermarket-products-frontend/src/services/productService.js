import apiClient from './apiClient'

const unwrap = (response) => response?.data?.data ?? response?.data
const idPath = (id) => encodeURIComponent(String(id))

export const productService = {
  async getAll(config) {
    const response = await apiClient.get('', config)
    const body = unwrap(response)
    if (Array.isArray(body)) return body
    if (Array.isArray(body?.products)) return body.products
    if (Array.isArray(body?.items)) return body.items
    return []
  },
  async getActive(config) {
    const response = await apiClient.get('/is-active', config)
    const body = unwrap(response)
    if (Array.isArray(body)) return body
    if (Array.isArray(body?.products)) return body.products
    if (Array.isArray(body?.items)) return body.items
    return []
  },
  async getById(id, config) {
    const response = await apiClient.get(`/${idPath(id)}`, config)
    return unwrap(response)
  },
  async create(payload) {
    const response = await apiClient.post('', payload)
    return unwrap(response)
  },
  async update(id, payload) {
    const response = await apiClient.put(`/${idPath(id)}`, payload)
    return unwrap(response)
  },
  async remove(id) {
    const response = await apiClient.delete(`/${idPath(id)}`)
    return unwrap(response)
  },
  async softDelete(id) {
    const response = await apiClient.patch(`/${idPath(id)}/soft-delete`)
    return unwrap(response)
  },
  async restore(id) {
    const response = await apiClient.patch(`/${idPath(id)}/restore`)
    return unwrap(response)
  },
  async updateStatus(id, status) {
    // Se envía status en el body; elimina el segundo argumento si tu backend lo alterna automáticamente.
    const response = await apiClient.patch(`/${idPath(id)}/status`, { status })
    return unwrap(response)
  },
  async toggleActive(id, isActive) {
    // Se envía isActive explícito para que la acción sea determinista.
    const response = await apiClient.patch(`/${idPath(id)}/is-active`, { isActive })
    return unwrap(response)
  },
}

export default productService