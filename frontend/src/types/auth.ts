export type Role = "SUPER_ADMIN" | "TRUSTEE" | "ACCOUNTANT" | "MANAGER" | "VOLUNTEER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};
