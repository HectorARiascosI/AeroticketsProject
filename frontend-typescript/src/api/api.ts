import axios from "axios";

/**
 * Cliente Axios centralizado para todas las peticiones al backend.
 * Se conecta a la API local de Spring Boot.
 */
const api = axios.create({
  baseURL: "http://localhost:8080", // ❌ sin /api, para evitar duplicados
  headers: { "Content-Type": "application/json" },
});

// 🔐 Agrega token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Endpoints centralizados
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    PROFILE: "/api/auth/me",
  },
  FLIGHTS: "/api/flights",
};