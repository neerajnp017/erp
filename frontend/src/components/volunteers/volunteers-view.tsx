"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Heart, 
  Phone, 
  Pencil,
  Trash2,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EntityModal } from "@/components/shared/entity-modal";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { api } from "@/services/api";

type Volunteer = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  status: string;
};

export function VolunteersView() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchVolunteers = React.useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/volunteers");
      setVolunteers(data);
    } catch (_error) {
      toast.error("Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const departments = ["All", ...Array.from(new Set(volunteers.map(v => v.department)))];
  
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(search.toLowerCase()) || 
                         volunteer.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "All" || volunteer.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const activeVolunteers = volunteers.filter(v => v.status === "Active").length;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/volunteers/${deleteId}`);
      toast.success("Volunteer record removed");
      fetchVolunteers();
    } catch (_error) {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Sewa Community" 
        description="Manage the dedicated volunteers who support the temple's daily operations and festivals."
      />

      {/* Summary Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-xl glass-card relative overflow-hidden group bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="h-16 w-16 text-emerald-600" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Total Volunteers</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-950">{volunteers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-bold text-emerald-900/40">Registered community members</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-16 w-16 text-emerald-600" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Active Status</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-950">{activeVolunteers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-bold text-emerald-900/40">Volunteers currently available</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl glass-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Building2 className="h-16 w-16 text-emerald-600" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60">Departments</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-950">{departments.length - 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-bold text-emerald-900/40">Different service areas</p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
          <EntityModal
            trigger={
              <Button className="w-full h-full min-h-[120px] rounded-3xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200/50 flex flex-col gap-2 group transition-all text-white">
                <Plus className="h-8 w-8 group-hover:scale-125 transition-transform" />
                <span className="font-black uppercase tracking-tighter">Add Volunteer</span>
              </Button>
            }
            title="Register New Volunteer"
            description="Add a new member to the temple sewa community."
          >
            <VolunteerForm onSuccess={fetchVolunteers} />
          </EntityModal>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/40 p-4 rounded-3xl backdrop-blur-md border border-white/20">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/40 group-focus-within:text-emerald-600 transition-colors" />
          <Input 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-white/50 border-none rounded-2xl focus-visible:ring-emerald-500 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={selectedDept === dept ? "default" : "ghost"}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "rounded-xl font-bold text-xs h-10 px-5 transition-all",
                selectedDept === dept ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "text-emerald-900/60 hover:bg-emerald-50"
              )}
            >
              {dept}
            </Button>
          ))}
        </div>
      </div>

      {/* Table View of Volunteers */}
      <Card className="border-none shadow-2xl glass-card rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-emerald-600/5 border-b border-emerald-900/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Volunteer Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Department</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Contact Number</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-8 bg-emerald-50 rounded-lg w-full" /></td>
                    </tr>
                  ))
                ) : filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Heart className="h-12 w-12 text-emerald-100 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-emerald-950">No volunteers found</h3>
                      <p className="text-emerald-900/40">Try a different search or department filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="group hover:bg-emerald-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-200">
                            {volunteer.name[0]}
                          </div>
                          <span className="font-bold text-emerald-950">{volunteer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-emerald-900/60">
                         {volunteer.department}
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2 text-xs font-bold text-emerald-900/60">
                           <Phone className="h-3 w-3 text-emerald-600" />
                           {volunteer.phoneNumber}
                         </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge className={cn(
                          "border-none font-black text-[10px] rounded-lg px-3 py-1",
                          volunteer.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        )}>
                          {volunteer.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                           <EntityModal
                             trigger={
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-emerald-600 hover:bg-emerald-50">
                                 <Pencil className="h-4 w-4" />
                               </Button>
                             }
                             title="Edit Volunteer Details"
                           >
                             <VolunteerForm initialData={volunteer} onSuccess={fetchVolunteers} />
                           </EntityModal>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 rounded-xl text-red-400 hover:bg-red-50"
                             onClick={() => setDeleteId(volunteer.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationModal 
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
