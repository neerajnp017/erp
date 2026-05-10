"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navigationItems } from "@/constants/navigation";
import { roleLabels } from "@/constants/rbac";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = navigationItems;

  return (
    <>
      {open ? <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => onOpenChange(false)} /> : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-4 my-4 z-50 flex w-64 flex-col glass-card rounded-2xl transition-transform shadow-2xl lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0",
        )}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <p className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              TEMPLE ERP
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {mounted && user ? roleLabels[user.role] : "Secure System"}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-emerald-100/50" onClick={() => onOpenChange(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4 custom-scrollbar">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  if (open) onOpenChange(false);
                }}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition-all duration-200 group active:scale-[0.98]",
                  active 
                    ? "bg-primary text-white shadow-lg shadow-emerald-200/50" 
                    : item.disabled
                      ? "opacity-40 cursor-not-allowed grayscale"
                      : "text-muted-foreground hover:bg-emerald-50/50 hover:text-primary",
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-primary/70")} />
                  <span>{item.title}</span>
                </div>
                {item.disabled && (
                  <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">P2</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-emerald-100/10 dark:border-emerald-900/10">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200/50">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black tracking-tight text-emerald-950 dark:text-emerald-50 truncate">
                {mounted && user?.name || "Admin User"}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 truncate">
                {mounted && user?.role?.replace("_", " ") || "Super Admin"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
