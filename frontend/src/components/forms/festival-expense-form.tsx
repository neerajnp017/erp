"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function FestivalExpenseForm({ 
  deptId,
  onSuccess,
  initialData
}: { 
  deptId: number;
  onSuccess?: () => void;
  initialData?: { name: string; amount: number; category: string; id?: number };
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      amount: Number(formData.get("amount")),
      category: formData.get("category")
    };

    const url = isEditing 
      ? `/festivals/expenses/${initialData?.id}`
      : `/festivals/departments/${deptId}/expenses`;
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Expense updated" : "Expense logged");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Error connecting to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Expense Name / Service
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          placeholder="e.g. Flower Decoration, Catering Service"
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            defaultValue={initialData?.category}
            placeholder="Service, Material, etc."
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
        {loading ? "Processing..." : isEditing ? "Save Changes" : "Log Seva Expense"}
      </Button>
    </form>
  );
}
