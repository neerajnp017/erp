"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DonationForm } from "@/components/forms/donation-form";
import { PayrollForm } from "@/components/forms/payroll-form";
import { InventoryForm } from "@/components/forms/inventory-form";
import { FestivalForm } from "@/components/forms/festival-form";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { KitchenForm } from "@/components/forms/kitchen-form";
import { DataTable } from "@/components/shared/data-table";
import { EntityModal } from "@/components/shared/entity-modal";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleCopy, moduleRecords } from "@/services/modules.service";
import type { ModuleRecord } from "@/types/modules";
import { formatCurrency, formatDate } from "@/utils/format";
import { api } from "@/services/api";

const columns = [
  { key: "id", header: "Reference" },
  { key: "name", header: "Name" },
  { key: "category", header: "Category" },
  { key: "amount", header: "Amount", render: (row: ModuleRecord) => (row.amount ? formatCurrency(row.amount) : "-") },
  { key: "status", header: "Status", render: (row: ModuleRecord) => <StatusBadge status={row.status} /> },
  { key: "date", header: "Date", render: (row: ModuleRecord) => formatDate(row.date) },
];

export function ModulePage({ module }: { module: keyof typeof moduleCopy }) {
  const [records, setRecords] = useState<ModuleRecord[]>(moduleRecords);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const copy = moduleCopy[module];

  const fetchRecords = () => {
    const modulesWithBackend = ["payroll", "expenses", "donations", "inventory", "festivals", "volunteers", "kitchen"];
    if (modulesWithBackend.includes(module)) {
      setLoading(true);
      api.get(`/${module}`)
        .then(({ data }) => {
          const mapped = data.map((item: any) => ({
            id: `B-${item.id}`,
            name: item.name || item.personName || item.donorName || item.itemName || item.title,
            category: item.category || item.role || item.department || "General",
            amount: item.amount || item.budget || item.quantity,
            status: item.status,
            date: item.date || item.paymentDate || "2026-05-09",
          }));
          setRecords([...moduleRecords, ...mapped]);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setRecords(moduleRecords);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRecords();
  }, [module]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;

    if (!id.startsWith("B-")) {
      toast.error("Cannot delete mock records.");
      setDeleteId(null);
      return;
    }

    const realId = id.split("-")[1];
    try {
      await api.delete(`/${module}/${realId}`);
      toast.success("Record removed successfully");
      fetchRecords();
    } catch (error) {
      toast.error("Failed to connect to backend");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: "id", header: "Reference" },
    { key: "name", header: "Name" },
    { key: "category", header: "Category" },
    { key: "amount", header: "Amount", render: (row: ModuleRecord) => (row.amount ? formatCurrency(row.amount) : "-") },
    ...(module !== "payroll" ? [{ key: "status", header: "Status", render: (row: ModuleRecord) => <StatusBadge status={row.status} /> }] : []),
    ...(module !== "payroll" ? [{ key: "date", header: "Date", render: (row: ModuleRecord) => formatDate(row.date) }] : []),
    {
      key: "actions",
      header: "Actions",
      render: (row: ModuleRecord) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <EntityModal
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-100/50"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
            title={`Edit ${copy.title}`}
            description="Update the details for this record."
          >
            {module === "payroll" ? (
              <PayrollForm
                initialData={{ name: row.name, amount: row.amount, role: row.category, id: row.id.split("-")[1] }}
                onSuccess={fetchRecords}
              />
            ) : module === "donations" ? (
              <DonationForm
                initialData={{ donorName: row.name, amount: row.amount, category: row.category, description: "", id: row.id.split("-")[1] }}
                onSuccess={fetchRecords}
              />
            ) : module === "inventory" ? (
              <InventoryForm
                initialData={{ itemName: row.name, quantity: row.amount, unit: "kg", category: row.category, id: row.id.split("-")[1] }}
                onSuccess={fetchRecords}
              />
            ) : module === "festivals" ? (
              <FestivalForm
                initialData={{ title: row.name, date: row.date, budget: row.amount, id: row.id.split("-")[1] }}
                onSuccess={fetchRecords}
              />
            ) : module === "volunteers" ? (
              <VolunteerForm
                initialData={{ name: row.name, department: row.category, status: row.status, id: row.id.split("-")[1] }}
                onSuccess={fetchRecords}
              />
            ) : module === "kitchen" ? (
              <KitchenForm
                initialData={{ itemName: row.name, quantity: row.amount, unit: "kg", id: row.id.split("-")[1] }}
                onSuccess={fetchRecords}
              />
            ) : (
              <p className="text-muted-foreground p-4">Edit for {module} coming soon.</p>
            )}
          </EntityModal>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const form =
    module === "donations" ? <DonationForm onSuccess={fetchRecords} /> :
      module === "payroll" ? <PayrollForm onSuccess={fetchRecords} /> :
        module === "inventory" ? <InventoryForm onSuccess={fetchRecords} /> :
          module === "festivals" ? <FestivalForm onSuccess={fetchRecords} /> :
            module === "volunteers" ? <VolunteerForm onSuccess={fetchRecords} /> :
    module === "kitchen" ? <KitchenForm onSuccess={fetchRecords} /> :
                <p className="text-muted-foreground">Connect this form to the module API contract.</p>;

  return (
    <div>
      <PageHeader title={copy.title} description={copy.description} />
      <div className="mb-5 flex justify-end">
        <EntityModal
          trigger={<Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/50">{copy.action}</Button>}
          title={copy.action}
          description={`Create a new ${copy.title.toLowerCase()} record.`}
        >
          {form}
        </EntityModal>
      </div>
      <Card className="border-none shadow-2xl glass-card rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/5">
          <CardTitle className="text-xl font-bold text-emerald-950 dark:text-emerald-50">{copy.title} Register</CardTitle>
          <CardDescription>Responsive, reusable table pattern for ERP records.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!mounted || loading ? (
            <div className="flex justify-center p-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent shadow-lg" />
            </div>
          ) : (
            <DataTable columns={columns} data={records} />
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
