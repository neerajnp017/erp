"use client";

import { useState, useEffect } from "react";
import { LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

export function Topbar({ mobileMenu }: { mobileMenu: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleLogout() {
    logout();
    toast.success("Signed out safely");
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 bg-transparent py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-16 items-center gap-3 glass-card rounded-2xl px-6 shadow-lg">
        {mobileMenu}
        <div className="relative hidden flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/50" />
          <Input 
            className="max-w-md pl-10 border-none bg-emerald-50/50 dark:bg-emerald-950/20 focus-visible:ring-emerald-500 rounded-xl" 
            placeholder="Search records, members, or reports..." 
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden text-right sm:block border-r border-emerald-100 dark:border-emerald-900 pr-4">
            <p className="text-sm font-black tracking-tight text-emerald-950 dark:text-emerald-50">
              {mounted && user?.name || "Admin User"}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
          </Button>
        </div>
      </div>
    </header>
  );
}
