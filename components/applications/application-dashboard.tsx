"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Briefcase, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ApplicationTable,
  EmptyState,
} from "@/components/applications/application-table";
import {
  ApplicationDialog,
  ViewApplicationDialog,
} from "@/components/applications/application-dialog";
import { DeleteApplicationDialog } from "@/components/applications/delete-dialog";
import { SearchBar } from "@/components/applications/search-bar";
import {
  StatusFilter,
  type StatusFilterValue,
} from "@/components/applications/status-filter";
import { Pagination } from "@/components/applications/pagination";
import {
  ApplicationSkeleton,
  TableSkeleton,
} from "@/components/applications/application-skeleton";
import {
  useApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "@/hooks/use-applications";
import { toast } from "@/hooks/use-toast";
import type { ApplicationDTO } from "@/types/application";
import type { CreateApplicationInput } from "@/lib/validations";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function ApplicationDashboard() {
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationDTO | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = {
    status: statusFilter,
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError, error } = useApplications(queryParams);
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const handleStatusChange = useCallback((value: StatusFilterValue) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleCreate = async (input: CreateApplicationInput) => {
    try {
      await createMutation.mutateAsync(input);
      toast({
        title: "Application added",
        description: `${input.jobTitle} at ${input.companyName} has been added.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to add application",
        description: err instanceof Error ? err.message : "Please try again.",
      });
      throw err;
    }
  };

  const handleUpdate = async (input: CreateApplicationInput) => {
    if (!selectedApplication) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedApplication.id,
        input,
      });
      toast({
        title: "Application updated",
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to update application",
        description: err instanceof Error ? err.message : "Please try again.",
      });
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!selectedApplication) return;
    try {
      await deleteMutation.mutateAsync(selectedApplication.id);
      toast({
        title: "Application deleted",
        description: `${selectedApplication.jobTitle} has been removed.`,
      });
      setDeleteOpen(false);
      setSelectedApplication(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to delete application",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const hasFilters =
    statusFilter !== "all" || debouncedSearch.trim().length > 0;
  const applications = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Job Application Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage and track your job applications
                </p>
              </div>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <StatusFilter value={statusFilter} onChange={handleStatusChange} />
            <SearchBar value={searchInput} onChange={setSearchInput} />
          </div>

          {isLoading && (
            <>
              <TableSkeleton />
              <ApplicationSkeleton />
            </>
          )}

          {isError && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Failed to load applications</p>
                <p className="text-sm opacity-90">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && applications.length === 0 && (
            <EmptyState hasFilters={hasFilters} />
          )}

          {!isLoading && !isError && applications.length > 0 && (
            <>
              <ApplicationTable
                applications={applications}
                onView={(app) => {
                  setSelectedApplication(app);
                  setViewOpen(true);
                }}
                onEdit={(app) => {
                  setSelectedApplication(app);
                  setEditOpen(true);
                }}
                onDelete={(app) => {
                  setSelectedApplication(app);
                  setDeleteOpen(true);
                }}
              />
              {pagination && (
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </main>

      <ApplicationDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      <ApplicationDialog
        mode="edit"
        application={selectedApplication ?? undefined}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />

      <ViewApplicationDialog
        application={selectedApplication}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <DeleteApplicationDialog
        application={selectedApplication}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
