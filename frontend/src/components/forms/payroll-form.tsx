"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function PayrollForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess?: () => void;
  initialData?: { name: string; amount: number; role: string; id?: string };
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      personName: formData.get("name"),
      amount: Number(formData.get("amount")),
      role: formData.get("role"),
    };

    const url = isEditing 
      ? `/payroll/${initialData?.id}`
      : "/payroll";
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Payroll record updated" : `Payroll processed for ${data.personName}`);
      if (!isEditing) (e.target as HTMLFormElement).reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Error connecting to backend service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 animate-fade-in">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Person Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="Enter full name"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Designation / Role
          </Label>
          <Input
            id="role"
            name="role"
            defaultValue={initialData?.role}
            placeholder="e.g. Priest, Maintenance, Security"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Amount (₹)
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            defaultValue={initialData?.amount}
            placeholder="0.00"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Processing..." : isEditing ? "Update Record" : "Process Payroll & Add to Expenses"}
      </Button>
    </form>
  );
}
