import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/utils/cn";
import type { TableColumn } from "@/types/common";

export function DataTable<T extends { id: string }>({ columns, data }: { columns: TableColumn<T>[]; data: T[] }) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <Table className="min-w-full">
        <TableHeader className="bg-emerald-50/30 dark:bg-emerald-950/10">
          <TableRow className="hover:bg-transparent border-b border-emerald-100 dark:border-emerald-900">
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={cn("py-5 px-6 text-[10px] font-black uppercase tracking-widest text-emerald-900/60 dark:text-emerald-100/60", column.className)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors border-b border-emerald-50 dark:border-emerald-900/50 last:border-0">
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={cn("py-4 px-6 text-sm font-medium transition-transform group-hover:translate-x-1", column.className)}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
