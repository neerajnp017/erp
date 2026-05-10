"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleMix } from "@/services/dashboard.service";

const colors = ["#059669", "#10b981", "#f59e0b", "#6366f1"];

export function ModulePieChart() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">Fund Allocation</h3>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">Donation Distribution</p>
      </div>
      <div className="h-80 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={moduleMix} 
              dataKey="value" 
              nameKey="name" 
              innerRadius={70} 
              outerRadius={100} 
              paddingAngle={5}
              stroke="none"
            >
              {moduleMix.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              formatter={(value, name) => [`${value}%`, name]} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
