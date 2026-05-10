"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function CategoryForm({ 
  onSuccess,
  initialName
}: { 
  onSuccess?: () => void;
  initialName?: string;
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialName);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("category");

    try {
      if (isEditing) {
        // Rename category (bulk update)
        await api.put(`/inventory/categories/${initialName}`, null, {
          params: { newName: categoryName }
        });
        toast.success(`Category renamed to "${categoryName}"`);
      } else {
        // Create new category (placeholder item)
        const data = {
          itemName: "Category Initialized",
          quantity: 0,
          unit: "pcs",
          category: categoryName,
          status: "Active"
        };
        await api.post("/inventory", data);
        toast.success(`Category "${categoryName}" created successfully`);
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          {isEditing ? "Rename Category" : "New Category Name"}
        </Label>
        <Input
          id="category"
          name="category"
          defaultValue={initialName}
          placeholder="e.g. Kitchen Supplies, Festival Rituals..."
          required
          autoFocus
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl h-14 text-lg font-bold"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-8 shadow-lg shadow-emerald-200/50 transition-all font-black text-lg uppercase tracking-widest"
      >
        {loading ? "Processing..." : isEditing ? "Update Category Name" : "Initialize Category"}
      </Button>
    </form>
  );
}
