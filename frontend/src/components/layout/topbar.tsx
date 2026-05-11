"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, Search, User, Wallet, Package, ReceiptText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/services/api";
import { cn } from "@/utils/cn";

export function Topbar({ mobileMenu }: { mobileMenu: React.ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/search?query=${debouncedQuery}`);
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery]);

  function handleLogout() {
    logout();
    toast.success("Signed out safely");
    router.replace("/login");
  }

  const hasResults = results && (
    results.donations?.length > 0 || 
    results.expenses?.length > 0 || 
    results.volunteers?.length > 0 || 
    results.inventory?.length > 0
  );

  return (
    <header className="sticky top-0 z-30 bg-transparent py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-16 items-center gap-3 glass-card rounded-2xl px-6 shadow-lg">
        {mobileMenu}
        
        <div ref={searchRef} className="relative hidden flex-1 sm:block max-w-md">
          <div className="relative">
            {loading ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-600" />
            ) : (
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/50" />
            )}
            <Input 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-10 border-none bg-emerald-50/50 dark:bg-emerald-950/20 focus-visible:ring-emerald-500 rounded-xl" 
              placeholder="Universal Search..." 
            />
          </div>

          {showResults && query.trim() && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-emerald-950 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-emerald-100 overflow-hidden max-h-[400px] overflow-y-auto z-50 animate-in fade-in zoom-in duration-200">
              {!loading && !hasResults && (
                <div className="p-8 text-center text-sm text-muted-foreground font-medium">
                  No matching records found for "{query}"
                </div>
              )}
              
              {hasResults && (
                <div className="p-2 space-y-4">
                  {results.donations?.length > 0 && (
                    <SearchSection title="Donations" icon={Wallet} items={results.donations} onSelect={(item: any) => router.push(`/donations`)} labelKey="donorName" />
                  )}
                  {results.volunteers?.length > 0 && (
                    <SearchSection title="Volunteers" icon={User} items={results.volunteers} onSelect={(item: any) => router.push(`/volunteers`)} labelKey="name" />
                  )}
                  {results.inventory?.length > 0 && (
                    <SearchSection title="Inventory" icon={Package} items={results.inventory} onSelect={(item: any) => router.push(`/inventory`)} labelKey="itemName" />
                  )}
                  {results.expenses?.length > 0 && (
                    <SearchSection title="Expenses" icon={ReceiptText} items={results.expenses} onSelect={(item: any) => router.push(`/expenses`)} labelKey="description" />
                  )}
                </div>
              )}
            </div>
          )}
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

function SearchSection({ title, icon: Icon, items, onSelect, labelKey }: any) {
  return (
    <div className="space-y-1 p-1">
      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50/50 rounded-lg flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3" /> {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item: any) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white text-emerald-950 transition-all text-left group"
          >
            <span className="flex-1 truncate">{item[labelKey]}</span>
            <span className="text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
