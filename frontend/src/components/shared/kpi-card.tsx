import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Kpi } from "@/types/modules";

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = trendIcon[kpi.trend];

  return (
    <Card className="glass-card border-none rounded-3xl overflow-hidden relative group">
      <div className={cn(
        "absolute top-0 right-0 p-8 opacity-5 transition-transform duration-500 group-hover:scale-150",
        kpi.trend === "up" ? "text-emerald-500" : kpi.trend === "down" ? "text-rose-500" : "text-amber-500"
      )}>
        <Icon className="h-24 w-24" />
      </div>
      <CardContent className="p-8 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
              {kpi.label}
            </span>
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black",
              kpi.trend === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" :
              kpi.trend === "down" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400" :
              "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            )}>
              <Icon className="h-3 w-3" />
              {kpi.trend === "up" ? "+12%" : kpi.trend === "down" ? "-5%" : "Stable"}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-4xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
              {kpi.value}
            </p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              {kpi.helper}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
