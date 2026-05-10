"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Users, 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2,
  ChevronRight,
  AlertCircle,
  FileText,
  Download,
  Target,
  IndianRupee
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "@/components/shared/entity-modal";
import { FestivalForm } from "@/components/forms/festival-form";
import { FestivalDeptForm } from "@/components/forms/festival-dept-form";
import { FestivalExpenseForm } from "@/components/forms/festival-expense-form";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { api } from "@/services/api";

type Festival = {
  id: number;
  title: string;
  date: string;
  budget: number;
  status: string;
  coordinator: string;
  description: string;
  departments: any[];
};

export function FestivalsView() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [compareWithId, setCompareWithId] = useState<number | null>(null);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/festivals");
      setFestivals(data);
    } catch (error) {
      toast.error("Failed to fetch festivals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchFestivals();
  }, []);

  if (!mounted) return null;

  const handleFestivalClick = async (id: number) => {
    try {
      const { data } = await api.get(`/festivals/${id}`);
      setSelectedFestival(data);
    } catch (error) {
      toast.error("Failed to load festival details");
    }
  };

  if (selectedFestival) {
    return <FestivalDetail 
      festival={selectedFestival} 
      onBack={() => setSelectedFestival(null)} 
      onRefresh={handleFestivalClick}
      allFestivals={festivals}
      compareWithId={compareWithId}
      setCompareWithId={setCompareWithId}
    />;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Festivals & Events" 
        description="Plan and manage events with organized excellence."
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="rounded-xl border-emerald-100 hover:bg-emerald-50 shadow-sm text-primary font-bold">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
        <EntityModal
          trigger={<Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50"><Plus className="mr-2 h-4 w-4" /> Schedule Festival</Button>}
          title="New Festival"
          description="Initialize a new festival plan."
        >
          <FestivalForm onSuccess={fetchFestivals} />
        </EntityModal>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent shadow-lg" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival) => {
            const actualExpenses = festival.departments?.reduce((acc: number, d: any) => 
              acc + (d.expenses?.reduce((s: number, e: any) => s + e.amount, 0) || 0), 0) || 0;
            const progress = Math.min((actualExpenses / festival.budget) * 100, 100);

            return (
              <Card 
                key={festival.id} 
                className="group overflow-hidden border-none shadow-xl glass-card transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => handleFestivalClick(festival.id)}
              >
                <div className="h-2 bg-gradient-to-r from-emerald-600 to-teal-600" />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold text-emerald-950">
                        {festival.title}
                      </CardTitle>
                      <div className="flex items-center text-xs font-semibold text-emerald-600/70">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(festival.date)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-emerald-900/60 line-clamp-2 leading-relaxed">
                    {festival.description || "Event celebrations planned with excellence."}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-emerald-950">
                      <span>Budget Utilization</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-emerald-100/50" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-600/50" />
                      <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">{festival.departments?.length || 0} Depts</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-600 group-hover:bg-emerald-50 rounded-lg font-bold">
                      Manage <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FestivalDetail({ 
  festival, 
  onBack, 
  onRefresh,
  allFestivals, 
  compareWithId, 
  setCompareWithId 
}: { 
  festival: Festival; 
  onBack: () => void; 
  onRefresh: (id: number) => void;
  allFestivals: Festival[];
  compareWithId: number | null;
  setCompareWithId: (id: number | null) => void;
}) {
  const [deleteDeptId, setDeleteDeptId] = useState<number | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);

  const compareFestival = allFestivals.find(f => f.id === compareWithId);
  const totalActual = festival.departments?.reduce((acc, dept) => 
    acc + (dept.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0), 0) || 0;
  
  const isOverBudget = totalActual > festival.budget;

  const handleDeleteDept = async () => {
    if (!deleteDeptId) return;
    try {
      await api.delete(`/festivals/departments/${deleteDeptId}`);
      toast.success("Department removed");
      onRefresh(festival.id);
    } catch (e) { toast.error("Delete failed"); }
    finally { setDeleteDeptId(null); }
  };

  const handleDeleteExpense = async () => {
    if (!deleteExpenseId) return;
    try {
      await api.delete(`/festivals/expenses/${deleteExpenseId}`);
      toast.success("Expense removed");
      onRefresh(festival.id);
    } catch (e) { toast.error("Delete failed"); }
    finally { setDeleteExpenseId(null); }
  };

  const scrollToDept = (id: number) => {
    const el = document.getElementById(`dept-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="rounded-xl hover:bg-emerald-50">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-black tracking-tight text-emerald-950">{festival.title}</h2>
          <p className="text-emerald-600/70 font-bold uppercase tracking-widest text-[10px]">Strategic Management Console</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="bg-emerald-50 border-none rounded-xl px-4 py-2 text-xs font-bold shadow-sm focus:ring-emerald-500 cursor-pointer"
            onChange={(e) => scrollToDept(Number(e.target.value))}
          >
            <option value="">Jump to Department...</option>
            {festival.departments?.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select 
            className="bg-emerald-50/50 border-none rounded-xl px-4 py-2 text-xs font-bold shadow-sm focus:ring-emerald-500 cursor-pointer"
            value={compareWithId || ""}
            onChange={(e) => setCompareWithId(Number(e.target.value) || null)}
          >
            <option value="">Compare History...</option>
            {allFestivals.filter(f => f.id !== festival.id).map(f => (
              <option key={f.id} value={f.id}>{f.title} ({new Date(f.date).getFullYear()})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Budget Summary Card */}
        <Card className="lg:col-span-2 border-none shadow-2xl glass-card overflow-hidden">
          <CardHeader className="bg-emerald-50/30 border-b border-emerald-900/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Financial Analysis</CardTitle>
                <CardDescription>Real-time budget utilization and variance.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Allocated Budget</p>
                <p className="text-3xl font-black text-emerald-950">{formatCurrency(festival.budget)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Current Burn</p>
                <p className={cn("text-3xl font-black", isOverBudget ? "text-red-600" : "text-emerald-600")}>
                  {formatCurrency(totalActual)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="opacity-50 uppercase tracking-widest">Utilization</span>
                <span className={cn(isOverBudget ? "text-red-600" : "text-emerald-600")}>
                  {Math.round((totalActual / festival.budget) * 100)}%
                </span>
              </div>
              <Progress value={Math.min((totalActual / festival.budget) * 100, 100)} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl glass-card bg-emerald-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" /> Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="opacity-70 uppercase text-[10px] tracking-widest">Depts Active</span>
                <span>{festival.departments?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="opacity-70 uppercase text-[10px] tracking-widest">Variance</span>
                <span className={isOverBudget ? "text-red-400" : "text-emerald-400"}>
                  {formatCurrency(festival.budget - totalActual)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Departments Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-emerald-950 tracking-tight">Departmental Logistics</h3>
          <EntityModal
            trigger={<Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50"><Plus className="mr-2 h-4 w-4" /> New Department</Button>}
            title="Initialize Department"
            description="Organize a new logistics group."
          >
            <FestivalDeptForm festivalId={festival.id} onSuccess={() => onRefresh(festival.id)} />
          </EntityModal>
        </div>

        <div className="space-y-8">
          {festival.departments?.map((dept) => (
            <div key={dept.id} id={`dept-${dept.id}`} className="scroll-mt-24 space-y-4">
              <Card className="border-none shadow-xl glass-card overflow-hidden">
                <div className="bg-emerald-900/5 px-6 py-4 flex items-center justify-between border-b border-emerald-900/10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                      {dept.name[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-emerald-950">{dept.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Lead: {dept.leaderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EntityModal
                      trigger={<Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-emerald-100 text-emerald-700"><Pencil className="h-4 w-4" /></Button>}
                      title={`Edit ${dept.name}`}
                    >
                      <FestivalDeptForm 
                        festivalId={festival.id} 
                        initialData={{ name: dept.name, leaderName: dept.leaderName, notes: dept.notes, id: dept.id }}
                        onSuccess={() => onRefresh(festival.id)} 
                      />
                    </EntityModal>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 text-red-500" onClick={() => setDeleteDeptId(dept.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 divide-x divide-emerald-900/5">
                    {/* Strategy Column */}
                    <div className="p-6 space-y-4 bg-emerald-50/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Logistical Notes</p>
                      <div className="p-4 rounded-xl bg-white/50 text-sm text-emerald-900/70 leading-relaxed min-h-[100px] max-h-[300px] overflow-y-auto break-words shadow-inner border border-emerald-900/5">
                        {dept.notes || "No strategic notes documented for this department yet."}
                      </div>
                    </div>
                    
                    {/* Expenses Column */}
                    <div className="md:col-span-2 p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Seva Expenses Log</p>
                        <EntityModal
                          trigger={<Button variant="ghost" size="sm" className="text-emerald-600 font-bold hover:bg-emerald-50">+ Log Expense</Button>}
                          title={`New Expense: ${dept.name}`}
                        >
                          <FestivalExpenseForm deptId={dept.id} onSuccess={() => onRefresh(festival.id)} />
                        </EntityModal>
                      </div>
                      
                      <div className="space-y-2">
                        {dept.expenses?.map((exp: any) => (
                          <div key={exp.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-400" />
                              <div>
                                <p className="text-sm font-bold text-emerald-950">{exp.name}</p>
                                <p className="text-[10px] text-emerald-900/40 font-bold">{exp.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-black text-emerald-900">{formatCurrency(exp.amount)}</span>
                              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                <EntityModal
                                  trigger={<Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-emerald-600"><Pencil className="h-3 w-3" /></Button>}
                                  title="Edit Expense"
                                >
                                  <FestivalExpenseForm 
                                    deptId={dept.id} 
                                    initialData={{ name: exp.name, amount: exp.amount, category: exp.category, id: exp.id }}
                                    onSuccess={() => onRefresh(festival.id)} 
                                  />
                                </EntityModal>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-red-400" onClick={() => setDeleteExpenseId(exp.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(!dept.expenses || dept.expenses.length === 0) && (
                          <p className="text-xs text-center py-8 text-emerald-900/30 font-bold italic">No expenses logged yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <DeleteConfirmationModal 
        isOpen={Boolean(deleteDeptId)} 
        onClose={() => setDeleteDeptId(null)} 
        onConfirm={handleDeleteDept} 
        title="Delete Department"
        description="Removing this department will also delete all associated expense logs. Continue?"
      />
      <DeleteConfirmationModal 
        isOpen={Boolean(deleteExpenseId)} 
        onClose={() => setDeleteExpenseId(null)} 
        onConfirm={handleDeleteExpense} 
        title="Remove Expense"
      />
    </div>
  );
}
