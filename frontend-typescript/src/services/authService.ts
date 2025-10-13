import api from "./api";

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  localStorage.setItem("vueler_token", data.token);
  localStorage.setItem("vueler_user", JSON.stringify({ fullName: data.fullName, email: data.email }));
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  localStorage.setItem("vueler_token", data.token);
  localStorage.setItem("vueler_user", JSON.stringify({ fullName: data.fullName, email: data.email }));
  return data;
}

export function logout() {
  localStorage.removeItem("vueler_token");
  localStorage.removeItem("vueler_user");
}