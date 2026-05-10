"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function InventoryForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess?: () => void;
  initialData?: { itemName: string; quantity: number; unit: string; category: string; reorderLevel?: number; id?: string };
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      itemName: formData.get("itemName"),
      quantity: Number(formData.get("quantity")),
      unit: formData.get("unit"),
      category: formData.get("category"),
      status: "In Stock"
    };

    const url = isEditing 
      ? `/inventory/${initialData?.id}`
      : "/inventory";
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Inventory item updated" : `Added ${data.itemName} to stock`);
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
      <div className="space-y-2">
        <Label htmlFor="itemName" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Item Name
        </Label>
        <Input
          id="itemName"
          name="itemName"
          defaultValue={initialData?.itemName}
          placeholder="e.g. Basmati Rice, Ghee, Incense Sticks"
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Quantity
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={initialData?.quantity}
            placeholder="0.00"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Unit
          </Label>
          <Input
            id="unit"
            name="unit"
            defaultValue={initialData?.unit}
            placeholder="kg, liters, boxes"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      {!initialData?.category && (
        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Category / Department
          </Label>
          <Input
            id="category"
            name="category"
            defaultValue={initialData?.category}
            placeholder="e.g. Kitchen, Rituals, Construction"
            required
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
      )}
      
      {initialData?.category && <input type="hidden" name="category" value={initialData.category} />}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Saving..." : isEditing ? "Update Stock" : "Add to Inventory"}
      </Button>
    </form>
  );
}
