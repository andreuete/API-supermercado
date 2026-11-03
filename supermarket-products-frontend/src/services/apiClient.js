import axios from 'axios'

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

export default apiClient