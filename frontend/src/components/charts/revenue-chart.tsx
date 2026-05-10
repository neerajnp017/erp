"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { donationTrend } from "@/services/dashboard.service";

export function RevenueChart() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">Financial Analytics</h3>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">Monthly Flow Analysis</p>
      </div>
      <div className="h-80 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={donationTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: "#6b7280" }} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: "#6b7280" }} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} 
            />
            <Legend iconType="circle" />
            <Bar dataKey="donations" name="Donations" fill="#059669" radius={[6, 6, 0, 0]} barSize={20} />
            <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
