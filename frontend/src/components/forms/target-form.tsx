"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";

export function TargetForm({ 
  initialTarget,
  onSuccess 
}: { 
  initialTarget: string;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount");

    try {
      await api.post("/settings", { 
        keyName: "collection_target", 
        settingValue: amount 
      });

      toast.success("Collection target updated");
      onSuccess?.();
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-emerald-900/60">
          Target Amount (₹)
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          defaultValue={initialTarget}
          placeholder="5000000"
          required
          className="border-none bg-emerald-50/50 focus-visible:ring-emerald-500 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 shadow-lg shadow-emerald-200/50 transition-all font-bold"
      >
        {loading ? "Saving..." : "Update Target"}
      </Button>
    </form>
  );
}
