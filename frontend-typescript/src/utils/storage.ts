export const storage = {
  getToken(): string | null {
    return localStorage.getItem("token");
  },
  setToken(token: string) {
    localStorage.setItem("token", token);
  },
  clearToken() {
    localStorage.removeItem("token");
  },
  getUser<T = any>(): T | null {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  },
  setUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem("user");
  },
  clearAll() {
    this.clearToken();
    this.clearUser();
  },
};