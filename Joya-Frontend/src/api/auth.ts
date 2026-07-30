import { api } from "./axios";
import type { AuthResponse, LoginResponse } from "../types/user";

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("/auth/me");

  return response.data;
};

type LoginCredentials = {
  username: string;
  password: string;
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);

  return response.data;
};