import api from "./api";
import type { ReservationRequest } from "../types";

export const createReservation = async (payload: ReservationRequest): Promise<string> => {
  const res = await api.post("/reservations", payload, { responseType: "text" });
  return res.data as string;
};

export const cancelReservation = async (reservationId: number, userId: number): Promise<string> => {
  const res = await api.post(`/reservations/${reservationId}/cancel`, null, {
    params: { userId },
    responseType: "text",
  });
  return res.data as string;
};