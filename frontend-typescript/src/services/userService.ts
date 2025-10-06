import api from "./api";
import type { UserRegistration, UserResponse } from "../types";

export const registerUser = async (payload: UserRegistration): Promise<UserResponse> => {
  const res = await api.post<UserResponse>("/users/register", payload);
  return res.data;
};