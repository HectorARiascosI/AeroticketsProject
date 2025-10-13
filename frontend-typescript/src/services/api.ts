import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// Inyecta token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vueler_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;