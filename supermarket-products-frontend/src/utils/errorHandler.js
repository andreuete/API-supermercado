import axios from 'axios'

const zodMessages = (issues) => {
  if (!Array.isArray(issues)) return []
  return issues.map((issue) => {
    const path = Array.isArray(issue.path) ? issue.path.join('.') : issue.path
    return path ? `${path}: ${issue.message || 'Dato no válido'}` : issue.message || 'Dato no válido'
  })
}

export function getErrorMessage(error) {
  if (error?.name === 'ZodError' && Array.isArray(error.issues)) {
    return error.issues.map((issue) => issue.message).join('\n')
  }
  if (!axios.isAxiosError(error)) return error?.message || 'Ha ocurrido un error inesperado.'

  const status = error.response?.status
  const data = error.response?.data
  const issues = data?.issues || data?.errors || data?.error?.issues
  const validation = zodMessages(issues)
  if (validation.length) return validation.join('\n')
  if (typeof data?.message === 'string') {
    const prefix = status === 409 ? 'Conflicto: ' : ''
    return `${prefix}${data.message}`
  }
  if (status === 400) return 'La solicitud no es válida. Revisa los campos e inténtalo de nuevo.'
  if (status === 404) return 'No se encontró el producto solicitado.'
  if (status === 409) return 'Existe un conflicto con este producto (posible duplicado).'
  if (status === 422) return 'El servidor no pudo validar los datos enviados.'
  if (status >= 500) return 'El servidor tuvo un problema. Inténtalo de nuevo más tarde.'
  if (error.code === 'ECONNABORTED') return 'La petición tardó demasiado. Inténtalo de nuevo.'
  if (!error.response) return 'No se pudo conectar con la API. Comprueba que el backend esté iniciado y que CORS esté configurado.'
  return `Error HTTP${status ? ` ${status}` : ''}. Inténtalo de nuevo.`
}

export function getFieldErrors(error) {
  const data = error?.response?.data
  const issues = data?.issues || data?.errors || data?.error?.issues
  if (!Array.isArray(issues)) return {}
  return issues.reduce((acc, issue) => {
    const path = Array.isArray(issue.path) ? issue.path[0] : issue.path
    if (path && issue.message) acc[path] = issue.message
    return acc
  }, {})
}

export function logApiError(error, context = '') {
  if (import.meta.env.DEV) console.error(`[API] ${context}`, error)
}