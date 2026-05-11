"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  ReceiptText, 
  Plus, 
  Search, 
  LayoutGrid, 
  List as ListIcon, 
  ArrowRight,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  FileText,
  Download,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "@/components/shared/entity-modal";
import { ExpenseForm } from "@/components/forms/expense-form";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";

import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export function ExpensesView() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"categories" | "items">("categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [catDeleteName, setCatDeleteName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter States
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [auditRange, setAuditRange] = useState({ start: "", end: "" });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/expenses", {
        params: {
          year: filterYear,
          month: filterMonth
        }
      });
      setItems(data);
    } catch (_error) {
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, [filterYear, filterMonth]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = Array.from(new Set(items.map(i => i.category || "General")));
  
  const filteredItems = items.filter(item => {
    const matchesCat = activeCategory ? item.category === activeCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const downloadCSV = (data: any[], filename: string) => {
    // Filter out payroll entries for the report
    const filteredData = data.filter(i => i.category !== "Staff Payroll");
    
    const headers = ["Date", "Expense Name", "Category", "Amount", "Status", "Description"];
    const rows = filteredData.map(i => [
      `'${i.date}`, // Prepend single quote to force Excel to treat as text if needed, or just clean date
      i.name,
      i.category,
      i.amount,
      i.status,
      i.description?.replace(/,/g, " ") || ""
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAuditExport = async () => {
    try {
      const { data } = await api.get("/expenses", {
        params: auditRange.start && auditRange.end 
          ? { startDate: auditRange.start, endDate: auditRange.end }
          : { year: filterYear, month: filterMonth }
      });
      downloadCSV(data, `Expense_Report_${new Date().toISOString().split("T")[0]}`);
      toast.success("Report downloaded successfully");
    } catch (_error) {
      toast.error("Export failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/expenses/${deleteId}`);
      toast.success("Expense removed");
      fetchItems();
    } catch (_error) {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (!catDeleteName) return;
    try {
      await api.delete(`/expenses/category/${catDeleteName}`);
      toast.success(`Category '${catDeleteName}' and all its entries removed`);
      fetchItems();
    } catch (_error) {
      toast.error("Delete category failed");
    } finally {
      setCatDeleteName(null);
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    try {
      await api.put(`/expenses/category/${oldName}`, null, {
        params: { newName }
      });
      toast.success("Category renamed");
      fetchItems();
    } catch (_error) {
      toast.error("Rename failed");
    }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setView("items");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-emerald-950 flex items-center gap-3">
            Expenses <TrendingDown className="h-8 w-8 text-red-500" />
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-emerald-900/60 font-medium">
              {view === "categories" ? "Browse expenses by category" : `Viewing items in ${activeCategory}`}
            </p>
            <div className="h-1 w-1 rounded-full bg-emerald-200" />
            <p className="text-sm font-black text-emerald-600">
              Grand Total: {formatCurrency(items.reduce((acc, i) => acc + i.amount, 0))}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-2xl shadow-sm border border-white/40">
             <select 
               className="bg-transparent text-sm font-bold text-emerald-900 outline-none px-2"
               value={filterMonth}
               onChange={(e) => setFilterMonth(Number(e.target.value))}
             >
               {Array.from({length: 12}).map((_, i) => (
                 <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
               ))}
             </select>
             <select 
               className="bg-transparent text-sm font-bold text-emerald-900 outline-none px-2"
               value={filterYear}
               onChange={(e) => setFilterYear(Number(e.target.value))}
             >
               {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
             </select>
          </div>

          <EntityModal
            trigger={
              <Button variant="outline" className="rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 h-12 px-6 font-bold text-emerald-700">
                <FileText className="mr-2 h-4 w-4" /> Financial Reports
              </Button>
            }
            title="Download Financial Report"
          >
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">Start Date</Label>
                    <Input type="date" value={auditRange.start} onChange={e => setAuditRange({...auditRange, start: e.target.value})} className="rounded-xl border-none bg-emerald-50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40">End Date</Label>
                    <Input type="date" value={auditRange.end} onChange={e => setAuditRange({...auditRange, end: e.target.value})} className="rounded-xl border-none bg-emerald-50" />
                  </div>
               </div>
               <div className="bg-emerald-50/50 p-4 rounded-2xl space-y-4">
                  <p className="text-xs font-bold text-emerald-900/60">Export will include all expenses for the selected range. Payroll data is excluded from this report.</p>
                  <Button onClick={handleAuditExport} className="w-full bg-emerald-600 rounded-xl h-12 font-black shadow-lg shadow-emerald-200/50">
                     <Download className="mr-2 h-4 w-4" /> Download Excel (CSV)
                  </Button>
               </div>
               <div className="max-h-[300px] overflow-auto rounded-2xl border border-emerald-100">
                  <table className="w-full text-[10px]">
                    <thead className="bg-emerald-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-black uppercase tracking-widest">Date</th>
                        <th className="px-3 py-2 text-left font-black uppercase tracking-widest">Item</th>
                        <th className="px-3 py-2 text-left font-black uppercase tracking-widest">Status</th>
                        <th className="px-3 py-2 text-right font-black uppercase tracking-widest">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                       {items.filter(i => i.category !== "Staff Payroll").map((item, i) => (
                         <tr key={i} className="hover:bg-emerald-50/30">
                           <td className="px-3 py-2">{item.date}</td>
                           <td className="px-3 py-2 font-bold">{item.name}</td>
                           <td className="px-3 py-2">
                             <Badge variant="outline" className={cn(
                               "text-[8px] px-1 py-0 border-none",
                               item.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                               item.status === "Pending" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                             )}>
                               {item.status}
                             </Badge>
                           </td>
                           <td className="px-3 py-2 text-right font-black">{formatCurrency(item.amount)}</td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </EntityModal>

          <EntityModal
            trigger={
              <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 h-12 px-8 font-black text-white transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5 stroke-[3]" /> Log Expense
              </Button>
            }
            title="New Expense Entry"
          >
            <ExpenseForm onSuccess={fetchItems} />
          </EntityModal>
        </div>
      </div>

      {view === "categories" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-48 bg-emerald-50 rounded-3xl animate-pulse" />)
          ) : (
            categories.map(cat => {
              const catItems = items.filter(i => i.category === cat);
              const totalAmount = catItems.reduce((acc, i) => acc + i.amount, 0);
              return (
                <Card 
                  key={cat} 
                  className="group relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 glass-card rounded-3xl overflow-hidden cursor-pointer"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}>
                      <EntityModal
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/80 hover:bg-white text-emerald-600">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        }
                        title="Rename Category"
                      >
                        <div className="p-4 space-y-4">
                          <Input id={`rename-${cat}`} defaultValue={cat} className="h-12 rounded-xl" />
                          <Button 
                            className="w-full h-12 rounded-xl bg-emerald-600"
                            onClick={() => {
                              const val = (document.getElementById(`rename-${cat}`) as HTMLInputElement).value;
                              handleRenameCategory(cat, val);
                            }}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </EntityModal>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-white/80 hover:bg-red-50 text-red-500"
                        onClick={() => setCatDeleteName(cat)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <TrendingDown className="h-24 w-24" />
                  </div>
                  <CardHeader>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Category</CardDescription>
                    <CardTitle className="text-2xl font-black text-emerald-950">{cat}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-900/40">{catItems.length} Entries</p>
                        <p className="text-lg font-black text-emerald-600">{formatCurrency(totalAmount)}</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        /* ITEMS TABLE VIEW */
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => { setView("categories"); setActiveCategory(null); }}
            className="rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 h-12 px-6 font-black text-emerald-700 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4 stroke-[3]" /> Back to Categories
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/40 p-4 rounded-3xl backdrop-blur-md border border-white/20">
            <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/40 group-focus-within:text-emerald-600 transition-colors" />
              <Input 
                placeholder={`Search in ${activeCategory}...`} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-white/50 border-none rounded-2xl focus-visible:ring-emerald-500 shadow-sm"
              />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 px-4">
              Showing {paginatedItems.length} of {filteredItems.length} entries
            </div>
          </div>

          <Card className="border-none shadow-2xl glass-card rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-emerald-600/5 border-b border-emerald-900/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Entry Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-center">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-center">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {paginatedItems.map((item, index) => (
                        <tr 
                          key={item.id} 
                          className={cn(
                            "group hover:bg-emerald-50/80 transition-colors",
                            index % 2 === 0 ? "bg-white/30" : "bg-emerald-50/30"
                          )}
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-400" />
                              <span className="font-bold text-emerald-950">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs font-bold text-emerald-900/60">{formatDate(item.date)}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-black px-3 py-1 border-none",
                              item.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                              item.status === "Pending" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {item.status || "Completed"}
                            </Badge>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-lg font-black text-emerald-950">{formatCurrency(item.amount)}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <EntityModal
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-100">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                }
                                title="Update Expense"
                              >
                                <ExpenseForm initialData={item} onSuccess={fetchItems} />
                              </EntityModal>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-red-400 hover:bg-red-50"
                                onClick={() => setDeleteId(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button 
                variant="ghost" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="rounded-xl h-10 w-10 p-0 text-emerald-600 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "h-10 w-10 rounded-xl font-bold",
                      currentPage === i + 1 ? "bg-emerald-600 shadow-lg shadow-emerald-200" : "text-emerald-900/60"
                    )}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="rounded-xl h-10 w-10 p-0 text-emerald-600 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <DeleteConfirmationModal 
        isOpen={Boolean(catDeleteName)}
        onClose={() => setCatDeleteName(null)}
        onConfirm={handleDeleteCategory}
        title={`Delete Category: ${catDeleteName}`}
        description="This will permanently remove this category and ALL expense entries within it. This action cannot be undone."
      />
    </div>
  );
}
