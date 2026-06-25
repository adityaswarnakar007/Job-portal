"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  type FetchApplicationsParams,
} from "@/lib/api";
import type { CreateApplicationInput, UpdateApplicationInput } from "@/lib/validations";
import type { ApplicationDTO, PaginatedApplications } from "@/types/application";

export const APPLICATIONS_QUERY_KEY = "applications";

export function useApplications(params: FetchApplicationsParams) {
  return useQuery({
    queryKey: [APPLICATIONS_QUERY_KEY, params],
    queryFn: () => fetchApplications(params),
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onMutate: async (newApplication) => {
      await queryClient.cancelQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });

      const previousQueries = queryClient.getQueriesData<PaginatedApplications>({
        queryKey: [APPLICATIONS_QUERY_KEY],
      });

      const optimisticApp: ApplicationDTO = {
        id: `temp-${Date.now()}`,
        companyName: newApplication.companyName,
        jobTitle: newApplication.jobTitle,
        jobType: newApplication.jobType,
        status: newApplication.status,
        appliedDate: new Date(newApplication.appliedDate).toISOString(),
        notes: newApplication.notes ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueriesData<PaginatedApplications>(
        { queryKey: [APPLICATIONS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [optimisticApp, ...old.data].slice(0, old.pagination.limit),
            pagination: {
              ...old.pagination,
              total: old.pagination.total + 1,
            },
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateApplicationInput;
    }) => updateApplication(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });

      const previousQueries = queryClient.getQueriesData<PaginatedApplications>({
        queryKey: [APPLICATIONS_QUERY_KEY],
      });

      queryClient.setQueriesData<PaginatedApplications>(
        { queryKey: [APPLICATIONS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((app) =>
              app.id === id
                ? {
                    ...app,
                    ...input,
                    appliedDate: input.appliedDate
                      ? new Date(input.appliedDate).toISOString()
                      : app.appliedDate,
                    updatedAt: new Date().toISOString(),
                  }
                : app
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });

      const previousQueries = queryClient.getQueriesData<PaginatedApplications>({
        queryKey: [APPLICATIONS_QUERY_KEY],
      });

      queryClient.setQueriesData<PaginatedApplications>(
        { queryKey: [APPLICATIONS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((app) => app.id !== id),
            pagination: {
              ...old.pagination,
              total: Math.max(0, old.pagination.total - 1),
            },
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [APPLICATIONS_QUERY_KEY] });
    },
  });
}
