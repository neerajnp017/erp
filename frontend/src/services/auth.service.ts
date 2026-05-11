import { api } from "./api";
import type { AuthSession } from "@/types/auth";

export type LoginPayload = {
  username: string;
  password: string;
};

// Backend returns { token: "...", username: "...", role: "..." }
type BackendLoginResponse = {
  token: string;
  username: string;
  role: string;
};

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await api.post<BackendLoginResponse>("/auth/login", payload);

  // Map the backend response into our frontend AuthSession shape
  return {
    accessToken: data.token,
    user: {
      id: data.username,
      name: data.username,
      email: data.username,
      role: data.role.replace("ROLE_", "") as AuthSession["user"]["role"],
    },
  };
}
