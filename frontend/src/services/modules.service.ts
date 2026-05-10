import type { ModuleRecord } from "@/types/modules";

export const moduleRecords: ModuleRecord[] = [];

export const moduleCopy: Record<string, { title: string; description: string; action: string }> = {
  donations: { title: "Donations", description: "Track receipts, donor intent, and daily collections.", action: "Add Donation" },
  inventory: { title: "Inventory", description: "Monitor temple supplies, reorder levels, and stock movement.", action: "Add Stock" },
  expenses: { title: "Expenses", description: "Review approvals, bills, vendors, and payment status.", action: "Record Expense" },
  payroll: { title: "Payroll", description: "Manage staff payments, monthly salaries, and payouts.", action: "Add Payroll Entry" },
  festivals: { title: "Festivals", description: "Plan events, budgets, seva bookings, and task ownership.", action: "Create Festival" },
  kitchen: { title: "Kitchen", description: "Coordinate annadanam, provisions, menus, and daily usage.", action: "Add Kitchen Entry" },
  volunteers: { title: "Volunteers", description: "Manage assignments, availability, teams, and attendance.", action: "Add Volunteer" },
  reports: { title: "Reports", description: "Export financial, operational, and compliance summaries.", action: "Generate Report" },
  users: { title: "User Management", description: "Control users, roles, access, and audit-ready permissions.", action: "Invite User" },
  settings: { title: "Settings", description: "Configure temple profile, receipt rules, and system preferences.", action: "Save Settings" },
};
