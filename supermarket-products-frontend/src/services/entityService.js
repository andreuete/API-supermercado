import { apiRootClient } from './apiClient'

const endpointFor = (entity) => {
  if (entity === 'brand') return '/brands'
  if (entity === 'category') return '/categories'
  throw new Error(`Entidad no soportada: ${entity}`)
}

const unwrap = (response) => response?.data?.data
const entityId = (entity) => encodeURIComponent(String(entity.id ?? entity._id))

export async function listEntities(entity) {
  const response = await apiRootClient.get(endpointFor(entity))
  const rows = unwrap(response)
  if (!Array.isArray(rows)) throw new Error('La API no devolvió una lista válida.')
  return rows.filter((row) => !row.deleted_at && !row.deletedAt)
}

export async function getEntity(entity, id) {
  const response = await apiRootClient.get(`${endpointFor(entity)}/${encodeURIComponent(id)}`)
  const result = unwrap(response)
  if (!result || typeof result.name !== 'string') throw new Error('La API no devolvió un registro válido.')
  return result
}

export async function createEntity(entity, values) {
  const response = await apiRootClient.post(endpointFor(entity), values)
  return unwrap(response)
}

export async function updateEntity(entity, id, values) {
  const response = await apiRootClient.put(`${endpointFor(entity)}/${encodeURIComponent(id)}`, values)
  return unwrap(response)
}

export { entityId }
