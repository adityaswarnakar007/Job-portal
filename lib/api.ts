import type {
  ApplicationDTO,
  PaginatedApplications,
  ApiError,
} from "@/types/application";
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
  ApplicationStatus,
} from "@/lib/validations";

export interface FetchApplicationsParams {
  status?: ApplicationStatus | "all";
  search?: string;
  page?: number;
  limit?: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new Error(error.error ?? "An unexpected error occurred");
  }

  return data as T;
}

function buildQueryString(params: FetchApplicationsParams): string {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.page) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchApplications(
  params: FetchApplicationsParams = {}
): Promise<PaginatedApplications> {
  const response = await fetch(
    `/api/applications${buildQueryString(params)}`,
    { cache: "no-store" }
  );
  return handleResponse<PaginatedApplications>(response);
}

export async function fetchApplication(id: string): Promise<ApplicationDTO> {
  const response = await fetch(`/api/applications/${id}`, {
    cache: "no-store",
  });
  return handleResponse<ApplicationDTO>(response);
}

export async function createApplication(
  input: CreateApplicationInput
): Promise<ApplicationDTO> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<ApplicationDTO>(response);
}

export async function updateApplication(
  id: string,
  input: UpdateApplicationInput
): Promise<ApplicationDTO> {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<ApplicationDTO>(response);
}

export async function deleteApplication(id: string): Promise<void> {
  const response = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
  });
  await handleResponse<{ message: string }>(response);
}
