"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Record",
  description = "Are you sure you want to delete this record? This action cannot be undone.",
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl glass-card border-none shadow-2xl animate-fade-in">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-emerald-950 dark:text-emerald-50">{title}</DialogTitle>
          <DialogDescription className="text-emerald-900/60 dark:text-emerald-100/60 pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-950 dark:text-emerald-50 font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200/50 dark:shadow-red-900/20 font-bold"
          >
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
