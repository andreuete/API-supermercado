import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRootClient } from '../services/apiClient'
import { AUTH_UNAUTHORIZED_EVENT, clearAuthSession, readAuthSession, saveAuthSession } from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readAuthSession)

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthSession()
      setSession(null)
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await apiRootClient.post('/auth/login', { email, password })
    const result = response?.data?.data
    if (typeof result?.token !== 'string' || !result.token || !result.user) {
      throw new Error('La API no devolvió una sesión válida.')
    }

    const nextSession = {
      token: result.token,
      user: result.user,
      roles: Array.isArray(result.roles) ? result.roles : result.user.role_ids || [],
    }
    saveAuthSession(nextSession)
    setSession(nextSession)
    return nextSession
  }, [])

  const logout = useCallback(async () => {
    try {
      if (session?.token) await apiRootClient.post('/auth/logout')
    } finally {
      clearAuthSession()
      setSession(null)
    }
  }, [session])

  const updateUser = useCallback((updates) => {
    if (!session) return
    const nextSession = {
      ...session,
      user: { ...session.user, ...updates },
    }
    saveAuthSession(nextSession)
    setSession(nextSession)
  }, [session])

  const hasPermission = useCallback((permission) => {
    const roles = Array.isArray(session?.roles) ? session.roles : []
    return roles.some((role) => (
      Array.isArray(role?.permissions) &&
      (role.permissions.includes('*') || role.permissions.includes(permission))
    ))
  }, [session])

  const value = useMemo(() => ({
    user: session?.user ?? null,
    roles: session?.roles ?? [],
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
    updateUser,
    hasPermission,
  }), [session, login, logout, updateUser, hasPermission])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  return context
}
