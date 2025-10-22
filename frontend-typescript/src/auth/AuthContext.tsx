import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import toast from "react-hot-toast";

export type User = { id?: number; fullName?: string; email: string; role?: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const u = localStorage.getItem("user")
    if (token && u) setUser(JSON.parse(u))
    setLoading(false)
  }, [])

  const register = async (payload: { username: string; email: string; password: string }) => {
    await api.post(ENDPOINTS.AUTH.REGISTER, {
      fullName: payload.username,
      email: payload.email,
      password: payload.password,
    });
    toast.success("Registro exitoso. Ahora inicia sesión.");
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    if (!data?.token) throw new Error("Backend no devolvió token");
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user ?? { email }))
    setUser(data.user ?? { email })
    toast.success("Bienvenido/a");
  };

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast('Sesión cerrada')
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};