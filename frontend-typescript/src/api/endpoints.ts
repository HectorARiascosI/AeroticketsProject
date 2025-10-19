export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT: '/auth/forgot-password',
    RESET: '/auth/reset-password'
  },
  FLIGHTS: '/flights',
  RESERVATIONS: {
    BASE: '/reservations',
    MINE: '/reservations/my'
  }
} as const