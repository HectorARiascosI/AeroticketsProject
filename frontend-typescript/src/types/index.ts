export type Flight = {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airline: string;
};

export type Reservation = {
  id: number;
  status: "ACTIVE" | "CANCELLED";
  flight: Flight;
  createdAt?: string;
};