import axios from 'axios'
import { AUTH_UNAUTHORIZED_EVENT, clearAuthSession, readAuthSession } from '../utils/authStorage'

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/products').replace(/\/$/, '')
const clientConfig = {
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
}

const apiClient = axios.create({ ...clientConfig, baseURL })

export const apiRootClient = axios.create({
  ...clientConfig,
  baseURL: baseURL.replace(/\/products$/, ''),
})

for (const client of [apiClient, apiRootClient]) {
  client.interceptors.request.use((config) => {
    const token = readAuthSession()?.token
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const isLoginRequest = /\/auth\/login(?:\?|$)/.test(error.config?.url || '')
      if (error.response?.status === 401 && !isLoginRequest) {
        clearAuthSession()
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
      }
      return Promise.reject(error)
    },
  )
}

export default apiClient