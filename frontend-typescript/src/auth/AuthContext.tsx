import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import api, { ENDPOINTS } from "@/api/api";
import toast from "react-hot-toast";

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /** 🧠 Cargar sesión al iniciar */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");
    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    setLoading(false);
  }, []);

  /** 🔐 Iniciar sesión */
  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      toast.success(`Bienvenido, ${data.user.username}`);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Credenciales inválidas o error de conexión.";
      toast.error(msg);
    }
  };

  /** 🧾 Registrar usuario */
  const register = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await api.post(ENDPOINTS.AUTH.REGISTER, payload);
      toast.success("Cuenta creada. Ahora inicia sesión.");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "No fue posible crear la cuenta.";
      toast.error(msg);
    }
  };

  /** 🚪 Cerrar sesión */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast("Sesión cerrada correctamente");
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};