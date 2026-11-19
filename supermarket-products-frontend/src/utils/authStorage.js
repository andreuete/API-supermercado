export const AUTH_STORAGE_KEY = 'supermarket-auth-session'
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export function readAuthSession() {
  const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!storedSession) return null

  try {
    const session = JSON.parse(storedSession)
    if (typeof session?.token === 'string' && session.token) return session
  } catch (error) {
    if (import.meta.env.DEV) console.error('[Auth] No se pudo leer la sesión guardada.', error)
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  return null
}

export function saveAuthSession(session) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
