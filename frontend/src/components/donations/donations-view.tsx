"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  User,
  Calendar,
  IndianRupee,
  TrendingUp,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  Target,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "@/components/shared/entity-modal";
import { DonationForm } from "@/components/forms/donation-form";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import { TargetForm } from "@/components/forms/target-form";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import { api } from "@/services/api";

type Donation = {
  id: number;
  donorName: string;
  category: string;
  amount: number;
  date: string;
  collectorName: string;
  volunteerName: string;
  description: string;
};

export function DonationsView() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [targetAmount, setTargetAmount] = useState<number>(5000000);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [donRes, statsRes, targetRes] = await Promise.all([
        api.get("/donations"),
        api.get("/donations/stats/monthly"),
        api.get("/settings/collection_target")
      ]);

      setDonations(donRes.data);
      if (targetRes.data?.settingValue) {
        setTargetAmount(Number(targetRes.data.settingValue));
      }

      // Transform stats map to array for Recharts
      const statsArray = Object.entries(statsRes.data).map(([name, amount]) => ({
        name,
        amount
      })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

      setStats(statsArray);
    } catch (error) {
      toast.error("Failed to fetch donation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let filteredDonations = donations;
  filteredDonations = filteredDonations.filter(d => new Date(d.date).getFullYear().toString() === selectedYear);

  if (selectedMonth !== "All") {
    filteredDonations = filteredDonations.filter(d => {
      const dMonth = new Date(d.date).toLocaleString('default', { month: 'long' });
      return dMonth.toUpperCase() === selectedMonth.toUpperCase();
    });
  }

  const totalDonation = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

  const filteredStats = stats.filter(stat => {
    if (selectedYear === "All") return true;
    return new Date(stat.name).getFullYear().toString() === selectedYear;
  });

  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from(new Set([currentYear, ...donations.map(d => new Date(d.date).getFullYear().toString())])).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Donations & Collections"
        description="Tracking the contributions that support our mission."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Card */}
        <Card className="lg:col-span-2 border-none shadow-2xl glass-card overflow-hidden">
          <CardHeader className="bg-emerald-50/30 border-b border-emerald-900/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Collection Trends</CardTitle>
                <CardDescription>Monthly donation performance analysis.</CardDescription>
              </div>
              <Badge className="bg-emerald-600 text-white border-none font-bold">
                Live Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: '#f0fdf4' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {filteredStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === filteredStats.length - 1 ? '#059669' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Heart className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg opacity-90">Total Filtered</CardTitle>
              <CardDescription className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                {selectedYear} - {selectedMonth}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-4xl font-black">{formatCurrency(totalDonation)}</p>
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>{filteredDonations.length} Contributions Recorded</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" /> Collection Target
                </CardTitle>
                <EntityModal
                  trigger={<Button variant="ghost" size="sm" className="h-8 px-2 text-emerald-600 font-bold">Edit</Button>}
                  title="Update Collection Target"
                  description="Set a new overall goal for donations."
                >
                  <TargetForm initialTarget={targetAmount.toString()} onSuccess={fetchData} />
                </EntityModal>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-50">Goal Progress</span>
                  <span>{Math.min(Math.round((totalDonation / targetAmount) * 100), 100)}%</span>
                </div>
                <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${Math.min((totalDonation / targetAmount) * 100, 100)}%` }} />
                </div>
              </div>
              <p className="text-[10px] text-emerald-900/40 font-bold leading-relaxed">
                Aiming to reach {formatCurrency(targetAmount)}.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls & Grid */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-md border-2 border-emerald-100 hover:border-emerald-300 transition-colors">
              <Filter className="h-5 w-5 text-emerald-600" />
              <select
                className="bg-transparent border-none text-base font-black focus:ring-0 cursor-pointer text-emerald-950"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="text-emerald-300">|</span>
              <select
                className="bg-transparent border-none text-base font-black focus:ring-0 cursor-pointer text-emerald-950"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map(m => (
                  <option key={m} value={m}>{m === "All" ? "All Months" : m}</option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExportOpen(true)}
              className="rounded-xl border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-bold py-6"
            >
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>

          <EntityModal
            trigger={<Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 px-8 py-6 font-bold text-lg"><Plus className="mr-2 h-6 w-6" /> Record New Donation</Button>}
            title="Record Contribution"
            description="Log a new donation with optional donor details and staff influencer."
          >
            <DonationForm onSuccess={fetchData} />
          </EntityModal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDonations.map((donation) => (
            <Card key={donation.id} className="group border-none shadow-lg glass-card overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="h-1.5 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-black">
                      {donation.donorName?.[0] || "A"}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{donation.donorName || "Anonymous"}</CardTitle>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">{donation.category}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-100 text-emerald-700 font-black">
                    {formatDate(donation.date)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-2xl font-black text-emerald-950">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                    {donation.amount.toLocaleString()}
                  </div>
                  <EntityModal
                    trigger={<div className="h-10 w-10 rounded-xl bg-emerald-50/50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 cursor-pointer transition-colors"><ArrowUpRight className="h-5 w-5" /></div>}
                    title="Update Donation"
                  >
                    <DonationForm initialData={donation} onSuccess={fetchData} />
                  </EntityModal>
                </div>

                <div className="pt-4 border-t border-emerald-50 flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-900/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>Staff: {donation.collectorName || "Direct"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>Vol: {donation.volunteerName || "None"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredDonations.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 p-20 text-center space-y-4 border-2 border-dashed border-emerald-100 rounded-3xl">
              <Heart className="h-12 w-12 text-emerald-100 mx-auto" />
              <p className="text-lg font-bold text-emerald-950">No Contributions Found</p>
              <p className="text-sm text-emerald-900/40">Try selecting a different month or year, or record a new donation.</p>
            </div>
          )}
        </div>
      </div>

      <ExportCsvModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} donations={donations} />
    </div>
  );
}

