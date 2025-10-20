export const storage = {
  setToken(t: string) { localStorage.setItem('token', t); },
  getToken() { return localStorage.getItem('token'); },
  setUser<T>(u: T) { localStorage.setItem('user', JSON.stringify(u)); },
  getUser<T>() { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) as T : null; },
  clearAll() { localStorage.removeItem('token'); localStorage.removeItem('user'); },
};