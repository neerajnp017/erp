"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export function Progress({ 
  value = 0, 
  className,
  ...props 
}: { 
  value?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-emerald-100/50 dark:bg-emerald-950/20",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-emerald-600 transition-all duration-500 ease-in-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
}
