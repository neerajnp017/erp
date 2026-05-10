import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import type { ModuleRecord } from "@/types/modules";

export function StatusBadge({ status }: { status: ModuleRecord["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all",
        status === "Completed" && "border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400",
        status === "Active" && "border-sky-200 bg-sky-50/50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400",
        status === "Pending" && "border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400",
        status === "Needs Review" && "border-rose-200 bg-rose-50/50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400",
      )}
    >
      <span className={cn(
        "mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse",
        status === "Completed" && "bg-emerald-500",
        status === "Active" && "bg-sky-500",
        status === "Pending" && "bg-amber-500",
        status === "Needs Review" && "bg-rose-500",
      )} />
      {status}
    </Badge>
  );
}
