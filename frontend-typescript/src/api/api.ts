import axios from "axios";

/**
 * Cliente Axios centralizado para todas las peticiones al backend.
 * Ajusta automáticamente la URL base según el entorno.
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api", // 👈 el backend corre aquí
  headers: { "Content-Type": "application/json" },
});

// 🔐 Interceptor para agregar el token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Endpoints centralizados
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/me",
  },
  FLIGHTS: "/flights",
};