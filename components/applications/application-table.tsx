"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/applications/status-badge";
import { JOB_TYPE_LABELS } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import type { ApplicationDTO } from "@/types/application";

interface ApplicationTableProps {
  applications: ApplicationDTO[];
  onView: (application: ApplicationDTO) => void;
  onEdit: (application: ApplicationDTO) => void;
  onDelete: (application: ApplicationDTO) => void;
}

function ActionButtons({
  application,
  onView,
  onEdit,
  onDelete,
}: {
  application: ApplicationDTO;
  onView: (application: ApplicationDTO) => void;
  onEdit: (application: ApplicationDTO) => void;
  onDelete: (application: ApplicationDTO) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(application)}
        aria-label={`View ${application.jobTitle} at ${application.companyName}`}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(application)}
        aria-label={`Edit ${application.jobTitle} at ${application.companyName}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(application)}
        aria-label={`Delete ${application.jobTitle} at ${application.companyName}`}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ApplicationTable({
  applications,
  onView,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Job Title</th>
              <th className="px-4 py-3 text-left font-medium">Job Type</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Applied</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{app.companyName}</td>
                <td className="px-4 py-3">{app.jobTitle}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {JOB_TYPE_LABELS[app.jobType]}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(app.appliedDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ActionButtons
                      application={app}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <article
            key={app.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold">{app.companyName}</h3>
                <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
              <span>{JOB_TYPE_LABELS[app.jobType]}</span>
              <span>{formatDate(app.appliedDate)}</span>
            </div>
            <ActionButtons
              application={app}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </article>
        ))}
      </div>
    </>
  );
}

export function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilters ? "No matching applications" : "No applications yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {hasFilters
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Get started by adding your first job application to track your progress."}
      </p>
    </div>
  );
}
