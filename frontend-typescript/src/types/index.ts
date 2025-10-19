export type Flight = {
  id: number
  origin: string
  destination: string
  airline: string
  price: number
  availableSeats: number
  departureTime: string
  arrivalTime: string
}

export type Reservation = {
  id: number
  status: 'ACTIVE' | 'CANCELLED'
  createdAt: string
  flight: Flight
}

export type User = {
  id: number
  username: string
  email: string
}