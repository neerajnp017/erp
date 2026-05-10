"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";

export function DonationForm({
  onSuccess,
  initialData
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [payrollPeople, setPayrollPeople] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    api.get("/payroll")
      .then(res => setPayrollPeople(res.data))
      .catch(() => toast.error("Failed to load staff list"));

    api.get("/volunteers")
      .then(res => setVolunteers(res.data))
      .catch(() => toast.error("Failed to load volunteers"));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      donorName: formData.get("donorName") || "Anonymous",
      amount: Number(formData.get("amount")),
      category: formData.get("category"),
      phoneNumber: formData.get("phoneNumber"),
      collectorName: formData.get("collectorName"),
      volunteerName: formData.get("volunteerName"),
      date: formData.get("date") || new Date().toISOString().split("T")[0],
      status: isEditing ? initialData.status : "COMPLETED",
      description: formData.get("description")
    };

    const url = isEditing
      ? `/donations/${initialData.id}`
      : "/donations";

    try {
      if (isEditing) {
        await api.put(url, data);
      } else {
        await api.post(url, data);
      }

      toast.success(isEditing ? "Donation record updated" : "Donation recorded successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2 animate-fade-in">
      <div className="grid gap-5 sm:grid-cols-2 items-start">
        <div className="space-y-2 flex flex-col justify-end h-full">
          <Label htmlFor="donorName" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Donor Name (Optional)
          </Label>
          <Input
            id="donorName"
            name="donorName"
            defaultValue={initialData?.donorName}
            placeholder="Anonymous"
            className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
          />
        </div>
        <div className="space-y-2 flex flex-col justify-end h-full">
          <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Amount (₹) *
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

      <div className="grid gap-5 sm:grid-cols-2 items-start">
        <div className="space-y-2 flex flex-col justify-end h-full">
          <Label className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Payroll Staff (Optional)
          </Label>
          <select
            name="collectorName"
            defaultValue={initialData?.collectorName || ""}
            className="w-full h-11 px-4 rounded-xl border-none bg-emerald-50/50 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">None / Direct</option>
            {payrollPeople.map(p => (
              <option key={p.id} value={p.personName}>{p.personName} ({p.role})</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-end h-full">
          <Label className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Volunteer (Optional)
          </Label>
          <select
            name="volunteerName"
            defaultValue={initialData?.volunteerName || ""}
            className="w-full h-11 px-4 rounded-xl border-none bg-emerald-50/50 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">None</option>
            {volunteers.map(v => (
              <option key={v.id} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 items-start">
        <div className="space-y-2 flex flex-col justify-end h-full">
          <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Purpose / Category
          </Label>
          <select
            name="category"
            defaultValue={initialData?.category || "General"}
            className="w-full h-11 px-4 rounded-xl border-none bg-emerald-50/50 text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="General">General Donation</option>
            <option value="Annadanam">Annadanam Seva</option>
            <option value="Construction">Temple Construction</option>
            <option value="Festival">Festival Contribution</option>
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-end h-full">
          <Label htmlFor="date" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
            Donation Date *
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Contact Number (Optional)
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          defaultValue={initialData?.phoneNumber}
          placeholder="+91"
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Notes / Remarks
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          placeholder="Special instructions or background..."
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl min-h-[80px]"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Processing..." : isEditing ? "Update Donation" : "Record Donation"}
      </Button>
    </form>
  );
}
