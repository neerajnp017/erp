import type { Role } from "@/types/auth";

export const roles: Role[] = ["SUPER_ADMIN", "TRUSTEE", "ACCOUNTANT", "MANAGER", "VOLUNTEER"];

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  TRUSTEE: "Trustee",
  ACCOUNTANT: "Accountant",
  MANAGER: "Manager",
  VOLUNTEER: "Volunteer",
};

export const routePermissions: Record<string, Role[]> = {
  "/dashboard": roles,
  "/donations": ["SUPER_ADMIN", "TRUSTEE", "ACCOUNTANT", "MANAGER"],
  "/inventory": ["SUPER_ADMIN", "TRUSTEE", "MANAGER", "VOLUNTEER"],
  "/expenses": ["SUPER_ADMIN", "TRUSTEE", "ACCOUNTANT"],
  "/payroll": ["SUPER_ADMIN"],
  "/festivals": ["SUPER_ADMIN", "TRUSTEE", "MANAGER", "VOLUNTEER"],
  "/kitchen": ["SUPER_ADMIN", "MANAGER", "VOLUNTEER"],
  "/volunteers": ["SUPER_ADMIN", "TRUSTEE", "MANAGER"],
  "/reports": ["SUPER_ADMIN", "TRUSTEE", "ACCOUNTANT"],
  "/users": ["SUPER_ADMIN"],
  "/settings": ["SUPER_ADMIN", "TRUSTEE"],
};
