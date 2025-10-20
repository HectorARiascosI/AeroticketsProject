export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  FLIGHTS: '/flights',
  RESERVATIONS: {
    BASE: '/reservations',
    MINE: '/reservations/my',
  },
} as const;