import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true
});

http.interceptors.request.use(config => {
  const t = localStorage.getItem("token");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export default http;