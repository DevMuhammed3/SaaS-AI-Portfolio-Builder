"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Template {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  font: string;
  primaryColor: string;
  secondaryColor: string;
  premium: boolean;
  status: "active" | "inactive";
}

interface TemplateDeleteModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateDelete: (templateId: string) => void;
}

export function TemplateDeleteModal({
  template,
  open,
  onOpenChange,
  onTemplateDelete,
}: TemplateDeleteModalProps) {
  const handleDelete = () => {
    if (template) {
      onTemplateDelete(template._id);
      onOpenChange(false);
    }
  };

  if (!template) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Template</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {template.title}? This action cannot
            be undone and will permanently remove the template from your
            collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
