import { api } from "./axios";
import type { AuthResponse } from "../types/user";

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("/auth/me");

  return response.data;
};
