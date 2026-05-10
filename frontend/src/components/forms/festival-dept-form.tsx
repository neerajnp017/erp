"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export function FestivalDeptForm({ 
  festivalId,
  onSuccess,
  initialData
}: { 
  festivalId: number;
  onSuccess?: () => void;
  initialData?: { name: string; leaderName: string; notes: string; id?: number };
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      leaderName: formData.get("leaderName"),
      notes: formData.get("notes")
    };

    const url = isEditing 
      ? `/festivals/departments/${initialData?.id}`
      : `/festivals/${festivalId}/departments`;
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Department updated" : "Department initialized");
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
          Department Name
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          placeholder="e.g. Kitchen, Decoration, Security"
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="leaderName" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Department Lead
        </Label>
        <Input
          id="leaderName"
          name="leaderName"
          defaultValue={initialData?.leaderName}
          placeholder="Enter lead name"
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Admin Notes / Strategy
        </Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={initialData?.notes}
          placeholder="Logistical plans, review of previous performance, or critical instructions..."
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl min-h-[120px]"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Processing..." : isEditing ? "Save Changes" : "Initialize Department"}
      </Button>
    </form>
  );
}
