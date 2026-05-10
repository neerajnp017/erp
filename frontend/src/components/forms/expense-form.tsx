"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export function ExpenseForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess?: () => void;
  initialData?: { name: string; amount: number; category: string; description: string; date: string; id?: string };
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
      category: formData.get("category"),
      date: formData.get("date"),
      description: formData.get("description"),
      status: formData.get("status")
    };

    const url = isEditing 
      ? `/expenses/${initialData?.id}`
      : "/expenses";
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Expense updated" : "Expense logged successfully");
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Expense Name
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            placeholder="e.g. Electricity Bill, Flower Purchase"
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
            placeholder="e.g. Utilities, Rituals, Maintenance"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
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
          <Label htmlFor="date" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Date
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={initialData?.date || new Date().toISOString().split("T")[0]}
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Payment Status
          </Label>
          <select
            id="status"
            name="status"
            defaultValue={initialData?.status || "Completed"}
            className="w-full h-10 px-3 border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl text-sm outline-none"
          >
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          placeholder="Add any relevant notes or invoice numbers..."
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Processing..." : isEditing ? "Update Expense" : "Log Expense"}
      </Button>
    </form>
  );
}
