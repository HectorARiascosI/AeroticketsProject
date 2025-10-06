import api from "./api";
import type { Flight } from "../types";

export const getAllFlights = async (): Promise<Flight[]> => {
  const res = await api.get<Flight[]>("/flights");
  return res.data;
};

export const createFlight = async (payload: Partial<Flight>) : Promise<Flight> => {
  const res = await api.post<Flight>("/flights", payload);
  return res.data;
};