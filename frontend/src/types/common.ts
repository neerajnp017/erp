import type { LucideIcon } from "lucide-react";
import type { Role } from "./auth";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  disabled?: boolean;
};

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};
