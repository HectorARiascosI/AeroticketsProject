import api from "./api";

// DTOs (ajústalos si ya los tienes en /types)
export type CreateReservationPayload = {
  flightId: number;
  seatNumber?: number; // opcional
};

export async function getMyReservations() {
  const res = await api.get("/reservations/my"); // ✅ OJO: /my (no /me)
  return res.data;
}

export async function createReservation(payload: CreateReservationPayload) {
  const res = await api.post("/reservations", payload);
  return res.data;
}

export async function cancelReservation(id: number) {
  // Backend expone DELETE /api/reservations/{id}
  const res = await api.delete(`/reservations/${id}`);
  return res.data;
}