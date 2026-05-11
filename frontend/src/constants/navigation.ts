import {
  BarChart3,
  CalendarDays,
  HandCoins,
  Home,
  Package,
  ReceiptText,
  Settings,
  Soup,
  Users,
  UserCog,
  Banknote,
} from "lucide-react";
import type { NavItem } from "@/types/common";
import { routePermissions } from "./rbac";

export const navigationItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home, roles: routePermissions["/dashboard"] },
  { title: "Donations", href: "/donations", icon: HandCoins, roles: routePermissions["/donations"] },
  { title: "Inventory", href: "/inventory", icon: Package, roles: routePermissions["/inventory"] },
  { title: "Expenses", href: "/expenses", icon: ReceiptText, roles: routePermissions["/expenses"] },
  { title: "Payroll", href: "/payroll", icon: Banknote, roles: routePermissions["/payroll"] || [] },
  { title: "Festivals", href: "/festivals", icon: CalendarDays, roles: routePermissions["/festivals"] },
  { title: "Kitchen", href: "/kitchen", icon: Soup, roles: routePermissions["/kitchen"], disabled: true },
  { title: "Volunteers", href: "/volunteers", icon: Users, roles: routePermissions["/volunteers"] },
  { title: "Reports", href: "/reports", icon: BarChart3, roles: routePermissions["/reports"], disabled: true },
  { title: "User Management", href: "/users", icon: UserCog, roles: routePermissions["/users"], disabled: true },
  { title: "Settings", href: "/settings", icon: Settings, roles: routePermissions["/settings"], disabled: true },
];
