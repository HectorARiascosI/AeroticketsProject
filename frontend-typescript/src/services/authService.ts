import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export async function requestReset(email: string) {
  return api.post(ENDPOINTS.AUTH.FORGOT, { email }).then((r) => r.data);
}

export async function resetPassword(token: string, password: string) {
  return api.post(ENDPOINTS.AUTH.RESET, { token, password }).then((r) => r.data);
}