"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  Layers, 
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  LayoutGrid,
  List,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "@/components/shared/entity-modal";
import { InventoryForm } from "@/components/forms/inventory-form";
import { CategoryForm } from "@/components/forms/category-form";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { api } from "@/services/api";

type InventoryItem = {
  id: number;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: string;
};

export function InventoryView() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"categories" | "items">("categories");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [catDeleteName, setCatDeleteName] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/inventory");
      setItems(data);
    } catch (error) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const categories = Array.from(new Set(items.map(i => i.category))).sort();
  
  const filteredItems = items.filter(item => {
    const isPlaceholder = item.itemName === "Category Initialized";
    if (isPlaceholder) return false;
    
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/inventory/${deleteId}`);
      toast.success("Item removed from inventory");
      fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const handleCategoryDelete = async () => {
    if (!catDeleteName) return;
    try {
      await api.delete(`/inventory/categories/${catDeleteName}`);
      toast.success(`Category "${catDeleteName}" and all its items deleted`);
      fetchItems();
    } catch (error) {
      toast.error("Category delete failed");
    } finally {
      setCatDeleteName(null);
    }
  };

  const getCategoryStats = (category: string) => {
    const catItems = items.filter(i => i.category === category && i.itemName !== "Category Initialized");
    return {
      count: catItems.length,
      lowStock: 0 // Reorder levels are removed
    };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between gap-4">
        <PageHeader 
          title={viewMode === "categories" ? "Inventory Registry" : `${activeCategory} Items`} 
          description={viewMode === "categories" ? "Select a category to manage specific stock items." : `Viewing all items within the ${activeCategory} category.`}
        />
        <div className="flex gap-2 mb-2">
           {viewMode === "items" && (
             <Button 
               variant="ghost" 
               onClick={() => { setViewMode("categories"); setActiveCategory(null); }}
               className="rounded-xl font-bold text-emerald-600 hover:bg-emerald-50"
             >
               <ChevronLeft className="mr-1 h-4 w-4" /> Categories
             </Button>
           )}
           <EntityModal
             trigger={
               <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 px-6 font-bold">
                 <Plus className="mr-2 h-5 w-5" /> {viewMode === "categories" ? "New Category" : "New Item"}
               </Button>
             }
             title={viewMode === "categories" ? "Create New Category" : "Add Item to Category"}
             description={viewMode === "categories" ? "Initialize a new department or supply area." : `Add a new product to ${activeCategory}.`}
           >
             {viewMode === "categories" ? (
               <CategoryForm onSuccess={fetchItems} />
             ) : (
               <InventoryForm onSuccess={fetchItems} initialData={{ itemName: "", quantity: 0, unit: "", category: activeCategory! }} />
             )}
           </EntityModal>
        </div>
      </div>

      {viewMode === "categories" ? (
        /* CATEGORIES GRID */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-48 rounded-3xl bg-emerald-50 animate-pulse" />)
          ) : (
            categories.map(cat => {
              const stats = getCategoryStats(cat);
              return (
                <Card 
                  key={cat} 
                  className="group cursor-pointer border-none shadow-xl glass-card hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden relative"
                  onClick={() => { setActiveCategory(cat); setViewMode("items"); setCurrentPage(1); }}
                >
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <EntityModal
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg bg-white/50 text-emerald-600 hover:bg-white shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                        title="Edit Category"
                      >
                        <CategoryForm initialName={cat} onSuccess={fetchItems} />
                      </EntityModal>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-white/50 text-red-500 hover:bg-white shadow-sm"
                        onClick={(e) => { e.stopPropagation(); setCatDeleteName(cat); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <Package className="h-24 w-24" />
                  </div>
                  <CardHeader>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Category</CardDescription>
                    <CardTitle className="text-2xl font-black text-emerald-950">{cat}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-900/40">{stats.count} Total Items</p>
                        {stats.lowStock > 0 && (
                          <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px]">
                            {stats.lowStock} Low Stock
                          </Badge>
                        )}
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
          
          {categories.length === 0 && !loading && (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-emerald-100 rounded-3xl">
                <LayoutGrid className="h-12 w-12 text-emerald-100 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-950">No Categories Found</h3>
                <p className="text-emerald-900/40">Add your first item to see categories here.</p>
             </div>
          )}
        </div>
      ) : (
        /* ITEMS TABLE VIEW */
        <div className="space-y-6">
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
              Showing {paginatedItems.length} of {filteredItems.length} items
            </div>
          </div>

          <Card className="border-none shadow-2xl glass-card rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-emerald-600/5 border-b border-emerald-900/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Item Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-center">Current Stock</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-transparent">
                    {paginatedItems.map((item, index) => {
                      const isLow = item.quantity <= item.reorderLevel;
                      return (
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
                              <span className="font-bold text-emerald-950">{item.itemName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-lg font-black text-emerald-950">
                                {item.quantity}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest">{item.unit}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <EntityModal
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-100">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                }
                                title="Update Stock"
                              >
                                <InventoryForm initialData={item} onSuccess={fetchItems} />
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {paginatedItems.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-emerald-900/40 font-bold">No items found matching your search.</p>
                </div>
              )}
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
        onConfirm={handleCategoryDelete}
      />
    </div>
  );
}
