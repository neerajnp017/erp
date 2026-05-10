"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { ProtectedRoute } from "./protected-route";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen premium-gradient">
        <Sidebar open={open} onOpenChange={setOpen} />
        <div className="lg:pl-72 flex flex-col min-h-screen">
          <Topbar
            mobileMenu={
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            }
          />
          <main key={pathname} className="flex-1 animate-fade-in mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
