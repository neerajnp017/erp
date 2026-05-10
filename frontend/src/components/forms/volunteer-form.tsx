"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function VolunteerForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess?: () => void;
  initialData?: any;
}) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phoneNumber: formData.get("phoneNumber"),
      department: formData.get("department"),
      status: "Active"
    };

    const url = isEditing 
      ? `/volunteers/${initialData.id}` 
      : "/volunteers";
    
    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Volunteer updated" : "Volunteer added successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 animate-fade-in">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={initialData?.name} 
            required 
            placeholder="e.g. Ramesh Kumar"
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl" 
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">Department / Sewa Area</Label>
            <Input 
              id="department" 
              name="department" 
              defaultValue={initialData?.department} 
              required 
              placeholder="e.g. Kitchen, Rituals, Admin"
              className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">Contact Number</Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              defaultValue={initialData?.phoneNumber} 
              required 
              placeholder="+91 XXXXX XXXXX"
              className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl" 
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Processing..." : isEditing ? "Update Volunteer Profile" : "Register Volunteer"}
      </Button>
    </form>
  );
}
