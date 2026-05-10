"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routePermissions } from "@/constants/rbac";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/shared/loading-state";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const segment = `/${pathname.split("/")[1]}`;
    const allowedRoles = routePermissions[segment];

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAuthenticated, pathname, router, user]);

  if (!hasHydrated || !isAuthenticated) {
    return <LoadingState title="Preparing your workspace" />;
  }

  return children;
}
