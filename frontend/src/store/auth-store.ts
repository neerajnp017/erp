"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, Role } from "@/types/auth";

function syncAuthCookie(isAuthenticated: boolean) {
  if (typeof document === "undefined") return;

  document.cookie = isAuthenticated
    ? "temple-erp-auth=1; path=/; max-age=604800; SameSite=Lax"
    : "temple-erp-auth=; path=/; max-age=0; SameSite=Lax";
}

type AuthStore = {
  session: AuthSession | null;
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
  canAccess: (roles: Role[]) => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      hasHydrated: false,
      setSession: (session) => {
        syncAuthCookie(true);
        set({ session });
      },
      logout: () => {
        syncAuthCookie(false);
        set({ session: null });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
      canAccess: (roles) => {
        const role = get().session?.user.role;
        return role ? roles.includes(role) : false;
      },
    }),
    {
      name: "temple-erp-auth",
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
