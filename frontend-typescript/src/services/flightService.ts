import http from "./http";

export const listFlights = async () => {
  const { data } = await http.get("/api/flights");
  return data;
};