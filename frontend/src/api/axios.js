import axios from 'axios'
import { API_URL } from './config'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Mensaje de error legible a partir de la respuesta del backend
export const errorMessage = (error, fallback = 'Ocurrió un error.') =>
  error?.response?.data?.message ||
  error?.response?.data?.errors?.[0]?.msg ||
  (error?.request && !error?.response ? 'No se pudo conectar con el servidor. ¿Está encendido el backend?' : '') ||
  fallback

export default api
