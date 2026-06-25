"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationForm } from "@/components/applications/application-form";
import { StatusBadge } from "@/components/applications/status-badge";
import { JOB_TYPE_LABELS } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import type { ApplicationDTO } from "@/types/application";
import type { CreateApplicationInput } from "@/lib/validations";

interface ViewApplicationDialogProps {
  application: ApplicationDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewApplicationDialog({
  application,
  open,
  onOpenChange,
}: ViewApplicationDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{application.jobTitle}</DialogTitle>
          <DialogDescription>{application.companyName}</DialogDescription>
        </DialogHeader>
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Job Type</dt>
            <dd className="font-medium">
              {JOB_TYPE_LABELS[application.jobType]}
            </dd>
          </div>
          <div className="flex justify-between gap-4 items-center">
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <StatusBadge status={application.status} />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Applied Date</dt>
            <dd className="font-medium">
              {formatDate(application.appliedDate)}
            </dd>
          </div>
          {application.notes && (
            <div>
              <dt className="text-muted-foreground mb-1">Notes</dt>
              <dd className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
                {application.notes}
              </dd>
            </div>
          )}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

interface ApplicationDialogProps {
  mode: "create" | "edit";
  application?: ApplicationDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function ApplicationDialog({
  mode,
  application,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: ApplicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Application" : "Edit Application"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Track a new job application."
              : "Update the details of this application."}
          </DialogDescription>
        </DialogHeader>
        <ApplicationForm
          key={application?.id ?? "new"}
          defaultValues={application}
          onSubmit={async (data) => {
            await onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          submitLabel={
            mode === "create" ? "Add Application" : "Save Changes"
          }
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
