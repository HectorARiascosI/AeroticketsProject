import http from "./http";

export const myReservations = async () => {
  const { data } = await http.get("/api/reservations/my");
  return data;
};

export const createReservation = async (payload: { flightId: number; seatNumber?: number; }) => {
  const { data } = await http.post("/api/reservations", payload);
  return data;
};

export const cancelReservation = async (id: number) => {
  await http.delete(`/api/reservations/${id}`);
};