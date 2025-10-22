export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT: '/auth/forgot-password',
    RESET: '/auth/reset-password'
  },
  FLIGHTS: '/flights',
  LIVE: {
    AIRPORTS_SEARCH: '/live/airports/search', // ?q=term
    SEARCH: '/live/flights/search'            // ?origin=bogota&destination=medellin | ?origin=BOG
  },
  RESERVATIONS: {
    BASE: '/reservations',
    MINE: '/reservations/my'
  }
} as const