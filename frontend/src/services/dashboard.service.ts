import type { Kpi } from "@/types/modules";
import { formatCurrency } from "@/utils/format";

export const dashboardKpis: Kpi[] = [
  { label: "Monthly Donations", value: formatCurrency(842500), helper: "+12% from last month", trend: "up" },
  { label: "Active Volunteers", value: "128", helper: "24 assigned today", trend: "up" },
  { label: "Inventory Alerts", value: "9", helper: "Needs purchase review", trend: "down" },
  { label: "Festival Tasks", value: "34", helper: "11 due this week", trend: "flat" },
];

export const donationTrend = [
  { month: "Jan", donations: 620000, expenses: 310000 },
  { month: "Feb", donations: 710000, expenses: 330000 },
  { month: "Mar", donations: 690000, expenses: 360000 },
  { month: "Apr", donations: 820000, expenses: 390000 },
  { month: "May", donations: 842500, expenses: 410000 },
];

export const moduleMix = [
  { name: "Puja", value: 38 },
  { name: "Annadanam", value: 26 },
  { name: "Festivals", value: 21 },
  { name: "Corpus", value: 15 },
];
