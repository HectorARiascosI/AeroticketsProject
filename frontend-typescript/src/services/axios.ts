import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',            // Gracias al proxy de Vite, va al backend
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Cargar token desde localStorage si lo manejas así:
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token') // ajusta si tu storage es distinto
  if (token) {
    cfg.headers = cfg.headers || {}
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
})

// Loguea los errores para NO dejar la app en blanco sin explicación
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const payload = err?.response?.data
    console.error('❌ API error:', status, payload || err.message)
    return Promise.reject(err)
  }
)