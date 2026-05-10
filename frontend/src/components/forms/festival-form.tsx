"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function FestivalForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess?: () => void;
  initialData?: { title: string; date: string; budget: number; id?: string };
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      date: formData.get("date"),
      budget: Number(formData.get("budget")),
      status: "Upcoming"
    };

    const url = isEditing 
      ? `/festivals/${initialData?.id}`
      : "/festivals";
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Festival updated" : `Event ${data.title} scheduled!`);
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
        <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Festival Name
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title}
          placeholder="e.g. Janmashtami, Diwali, Holi"
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
          defaultValue={initialData?.date}
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Estimated Budget (₹)
        </Label>
        <Input
          id="budget"
          name="budget"
          type="number"
          defaultValue={initialData?.budget}
          placeholder="0.00"
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Saving..." : isEditing ? "Update Festival" : "Schedule Festival"}
      </Button>
    </form>
  );
}
