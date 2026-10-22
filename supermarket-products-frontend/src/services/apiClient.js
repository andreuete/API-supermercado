import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/products').replace(/\/$/, '')

const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
})

export default apiClient