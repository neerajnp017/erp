"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/utils/cn";

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("text-base font-medium leading-none", className)} {...props} />;
}
