export type Flight = {
  id: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;   // ISO
  arriveAt: string;      // ISO
  totalSeats: number;
  price: number;
};

export type ReservationDTO = {
  id: number;
  seatNumber?: number | null;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string; // ISO

  flightId: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;   // ISO
  arriveAt: string;      // ISO
  price: number;
};