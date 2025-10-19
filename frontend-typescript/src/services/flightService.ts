import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { Flight } from "@/types";

export type FlightFilters = Partial<{
  origin: string;
  destination: string;
  date: string;
  airline: string;
}>;

export async function getFlights(filters?: FlightFilters): Promise<Flight[]> {
  const { data } = await api.get(ENDPOINTS.FLIGHTS, { params: filters });
  return data;
}