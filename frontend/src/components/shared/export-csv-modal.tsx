"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ExportCsvModal({
  isOpen,
  onClose,
  donations,
  type = "donations"
}: {
  isOpen: boolean;
  onClose: () => void;
  donations: any[];
  type?: "donations" | "expenses";
}) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear().toString();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["All", ...Array.from(new Set(donations.map(d => new Date(d.date).getFullYear().toString())))];

  const handleExport = () => {
    let filtered = donations;
    if (year !== "All") {
      filtered = filtered.filter(d => new Date(d.date).getFullYear().toString() === year);
    }
    if (month !== "All") {
      filtered = filtered.filter(d => new Date(d.date).toLocaleString('default', { month: 'long' }) === month);
    }

    const csvRows = [];

    if (type === "donations") {
      csvRows.push(["ID", "Donor Name", "Amount", "Category", "Date", "Phone", "Collector", "Volunteer", "Status"]);
      for (const d of filtered) {
        csvRows.push([
          d.id,
          `"${d.donorName || ''}"`,
          d.amount,
          `"${d.category || ''}"`,
          d.date,
          `"${d.phoneNumber || ''}"`,
          `"${d.collectorName || ''}"`,
          `"${d.volunteerName || ''}"`,
          `"${d.status || ''}"`
        ]);
      }
    } else {
      csvRows.push(["ID", "Expense Name", "Amount", "Category", "Date", "Status", "Description"]);
      for (const e of filtered) {
        csvRows.push([
          e.id,
          `"${e.name || ''}"`,
          e.amount,
          `"${e.category || ''}"`,
          e.date,
          `"${e.status || ''}"`,
          `"${e.description || ''}"`
        ]);
      }
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_${year}_${month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl glass-card border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-emerald-950">Export {type === "donations" ? "Donations" : "Expenses"} to CSV</DialogTitle>
          <DialogDescription className="text-emerald-900/60 pt-2">
            Select the specific time period to generate a report.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-emerald-900/60">Year</Label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border-none bg-emerald-50/50 text-sm focus:ring-2 focus:ring-emerald-500"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-emerald-900/60">Month</Label>
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border-none bg-emerald-50/50 text-sm focus:ring-2 focus:ring-emerald-500"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={handleExport} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Download CSV</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
