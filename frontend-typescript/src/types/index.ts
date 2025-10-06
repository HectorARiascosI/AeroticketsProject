export interface Flight {
  id: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string; // ISO string from backend
  arriveAt: string;    // ISO string
  totalSeats: number;
  price: number; // backend sends numeric (BigDecimal -> number)
  version?: number;
}

export interface ReservationRequest {
  userId: number;
  flightId: number;
  seatNumber?: number | null;
  // paymentMethod?: string;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}