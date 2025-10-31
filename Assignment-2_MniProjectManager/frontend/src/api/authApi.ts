import { api } from "./apiClient";

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export const register = async (username: string, email: string, password: string) => {
  const res = await api.post<AuthResponse>("/api/auth/register", { username, email, password });
  return res.data;
};

export const login = async (usernameOrEmail: string, password: string) => {
  const res = await api.post<AuthResponse>("/api/auth/login", { usernameOrEmail, password });
  return res.data;
};
