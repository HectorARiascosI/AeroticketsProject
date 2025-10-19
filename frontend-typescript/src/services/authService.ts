import api from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'

export async function requestReset(email: string) {
  const { data } = await api.post(ENDPOINTS.AUTH.FORGOT, { email })
  return data
}

export async function resetPassword(token: string, newPassword: string) {
  const { data } = await api.post(ENDPOINTS.AUTH.RESET, { token, newPassword })
  return data
}