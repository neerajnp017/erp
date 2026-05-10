"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Calendar,
  Wallet,
  Clock,
  ChevronRight,
  Banknote
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "@/components/shared/entity-modal";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { api } from "@/services/api";

type Summary = {
  totalDonations: number;
  totalExpenses: number;
  volunteerCount: number;
  totalPayroll: number;
  trend: any[];
  donationMix: any[];
  recentActivities: any[];
};

export function DashboardView() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [goalTarget, setGoalTarget] = useState(1000000);
  const [chartType, setChartType] = useState<"area" | "bar">("bar");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSummary = async () => {
    try {
      const [{ data: summaryData }, { data: settings }] = await Promise.all([
        api.get(`/dashboard/summary?year=${selectedYear}&month=${selectedMonth}`),
        api.get("/settings")
      ]);
      
      setSummary(summaryData);
      
      const targetSetting = settings.find((s: any) => s.keyName === "collection_target");
      if (targetSetting) setGoalTarget(Number(targetSetting.settingValue));
      
    } catch (error) {
      console.error("Dashboard fetch failed", error);
      toast.error("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedYear, selectedMonth]);

  const handleExport = () => {
    if (!summary) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(summary, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ERP_Dashboard_Summary_${selectedMonth}_${selectedYear}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Dashboard report exported as JSON");
  };

  if (loading || !summary) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-emerald-100 rounded-xl" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-emerald-50 rounded-3xl" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-emerald-50 rounded-3xl" />
          <div className="h-96 bg-emerald-50 rounded-3xl" />
        </div>
      </div>
    );
  }

  const COLORS = ["#059669", "#D97706", "#0D9488", "#4F46E5"];

  const progressPercent = Math.min(Math.round(((summary?.totalDonations || 0) / goalTarget) * 100), 100);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* ... existing header ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-emerald-950 flex items-center gap-3">
            Dashboard <Sparkles className="h-8 w-8 text-amber-500" />
          </h1>
          <p className="text-emerald-900/60 font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 
            <span className="opacity-40">|</span> 
            <span className="text-emerald-600 font-bold">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 h-12 px-4 font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 h-12 px-4 font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Contributions" 
          value={formatCurrency(summary.totalDonations ?? 0)} 
          helper="Real-time collection"
          icon={Wallet}
          color="emerald"
          onClick={() => router.push("/donations")}
        />
        <StatCard 
          label="Total Expenses" 
          value={formatCurrency(summary.totalExpenses ?? 0)} 
          helper={`Payroll commitment: ${formatCurrency(summary.totalPayroll ?? 0)}`}
          icon={TrendingUp}
          color="amber"
          negative
          onClick={() => router.push("/expenses")}
        />
        <StatCard 
          label="Sewa Community" 
          value={String(summary.volunteerCount ?? 0)} 
          helper="Registered Sewaks"
          icon={Users}
          color="teal"
          onClick={() => router.push("/volunteers")}
        />
        <StatCard 
          label="Payroll Maintenance" 
          value={formatCurrency(summary.totalPayroll ?? 0)} 
          helper="Staff Salary Commitment"
          icon={Banknote}
          color="emerald"
          onClick={() => router.push("/payroll")}
        />
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 border-none shadow-2xl glass-card rounded-3xl overflow-hidden group">
          <CardHeader className="bg-white/50 backdrop-blur-md border-b border-emerald-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-emerald-950">Financial Stream</CardTitle>
              <CardDescription>Visualizing contributions vs expenditures for the past months.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex bg-emerald-50 p-1 rounded-xl">
                  <button 
                    onClick={() => setChartType("area")}
                    className={cn("px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all", chartType === "area" ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-900/40 hover:text-emerald-600")}
                  >Area</button>
                  <button 
                    onClick={() => setChartType("bar")}
                    className={cn("px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all", chartType === "bar" ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-900/40 hover:text-emerald-600")}
                  >Bar</button>
               </div>
               <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none font-bold">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-10 pb-6 pr-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={summary.trend ?? []}>
                    <defs>
                      <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#064e3b', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#064e3b', fontSize: 12, fontWeight: 600}} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                      itemStyle={{fontWeight: 700}}
                    />
                    <Area type="monotone" dataKey="donations" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorDon)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                ) : (
                  <BarChart data={summary.trend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#064e3b', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#064e3b', fontSize: 12, fontWeight: 600}} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                      itemStyle={{fontWeight: 700}}
                    />
                    <Bar dataKey="donations" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donation Distribution */}
        <Card className="border-none shadow-2xl glass-card rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-emerald-950">Resource Mix</CardTitle>
            <CardDescription>Contribution breakdown by category.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.donationMix}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {summary.donationMix?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              {summary.donationMix?.slice(0, 4).map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900/60">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Stream */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-none shadow-xl glass-card rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-emerald-950">Recent Activity</CardTitle>
            <CardDescription>Latest transactions across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {summary.recentActivities?.map((activity, idx) => (
              <ActivityItem 
                key={idx}
                icon={Wallet} 
                title={activity.title} 
                time={activity.time} 
                text={`${activity.donor} contributed ${formatCurrency(activity.amount)}`} 
                color="emerald" 
              />
            ))}
            {(!summary.recentActivities || summary.recentActivities.length === 0) && (
               <p className="text-center text-xs text-emerald-900/40 py-10 font-bold">No recent activities found.</p>
            )}
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card className="lg:col-span-2 border-none shadow-xl glass-card rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
            <TrendingUp className="h-32 w-32 text-emerald-600" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-emerald-950">Collection Progress</CardTitle>
            <CardDescription>Monthly target vs current performance.</CardDescription>
          </CardHeader>
          <CardContent className="pb-10 pt-4">
             <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative h-48 w-48 flex items-center justify-center">
                    <svg className="h-full w-full rotate-[-90deg]">
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-emerald-50" />
                        <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray="502" strokeDashoffset={502 - (502 * (progressPercent / 100))} className="text-emerald-600 transition-all duration-1000" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-emerald-950">{progressPercent}%</span>
                        <span className="text-[10px] font-black uppercase text-emerald-900/40">Target</span>
                    </div>
                </div>
                <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-emerald-900/60 uppercase tracking-widest">
                            <span>Collection Goal</span>
                            <span>{formatCurrency(summary.totalDonations)} / {formatCurrency(goalTarget)}</span>
                        </div>
                        <div className="h-3 w-full bg-emerald-50 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full transition-all duration-1000" style={{width: `${progressPercent}%`}} />
                        </div>
                    </div>
                    <EntityModal
                      trigger={
                        <Button className="w-full h-12 rounded-2xl bg-emerald-950 hover:bg-black text-white font-bold text-sm transition-all group">
                            Update Targets <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      }
                      title="Update Collection Goal"
                    >
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const val = new FormData(e.currentTarget).get("target");
                          try {
                            await api.post("/settings", { keyName: "collection_target", settingValue: val });
                            setGoalTarget(Number(val));
                            toast.success("Collection target updated!");
                          } catch {
                            toast.error("Failed to update target");
                          }
                        }}
                        className="space-y-6 pt-4"
                      >
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-emerald-900/60">New Target Amount (₹)</label>
                          <input 
                            name="target"
                            type="number" 
                            defaultValue={goalTarget}
                            className="w-full h-14 rounded-xl bg-emerald-50 border-none px-4 text-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                          Save New Target
                        </Button>
                        <p className="text-xs text-emerald-900/40 italic text-center">This will update the progress trackers for your current session.</p>
                      </form>
                    </EntityModal>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, helper, icon: Icon, color, negative, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "border-none shadow-xl glass-card rounded-3xl group overflow-hidden relative cursor-pointer active:scale-95 transition-all",
        onClick && "hover:shadow-emerald-200/50 hover:shadow-2xl"
      )}
    >
      <div className={cn(
        "absolute top-0 right-0 p-8 opacity-5 transition-transform duration-500 group-hover:scale-150",
        color === "emerald" ? "text-emerald-600" : color === "amber" ? "text-amber-600" : "text-teal-600"
      )}>
        <Icon className="h-20 w-20" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">{label}</span>
            <div className={cn(
              "p-2 rounded-xl",
              color === "emerald" ? "bg-emerald-50 text-emerald-600" : color === "amber" ? "bg-amber-50 text-amber-600" : "bg-teal-50 text-teal-600"
            )}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-emerald-950">{value}</p>
            <div className="flex items-center gap-1">
              {negative ? <ArrowDownRight className="h-3 w-3 text-rose-500" /> : <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
              <span className="text-[10px] font-bold text-emerald-900/40">{helper}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ icon: Icon, title, time, text, color }: any) {
    return (
        <div className="flex gap-4 group cursor-pointer">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                color === "emerald" ? "bg-emerald-50 text-emerald-600 shadow-sm" : 
                color === "amber" ? "bg-amber-50 text-amber-600" : "bg-teal-50 text-teal-600"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-emerald-950">{title}</h4>
                    <span className="text-[10px] font-bold text-emerald-900/40 flex items-center gap-1">
                        <Clock className="h-2 w-2" /> {time}
                    </span>
                </div>
                <p className="text-xs text-emerald-900/60 font-medium line-clamp-1">{text}</p>
            </div>
        </div>
    );
}
