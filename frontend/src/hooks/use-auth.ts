"use client";

import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.accessToken),
    hasHydrated,
    logout,
  };
}
