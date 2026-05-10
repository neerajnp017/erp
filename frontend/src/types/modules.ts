export type Kpi = {
  label: string;
  value: string;
  helper: string;
  trend: "up" | "down" | "flat";
};

export type ModuleRecord = {
  id: string;
  name: string;
  category: string;
  amount?: number;
  status: "Completed" | "Pending" | "Needs Review" | "Active";
  date: string;
};
