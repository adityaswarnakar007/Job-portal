import type { Application, JobType, ApplicationStatus } from "@prisma/client";

export type { JobType, ApplicationStatus };

export interface ApplicationDTO {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApplications {
  data: ApplicationDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export function toApplicationDTO(application: Application): ApplicationDTO {
  return {
    id: application.id,
    companyName: application.companyName,
    jobTitle: application.jobTitle,
    jobType: application.jobType,
    status: application.status,
    appliedDate: application.appliedDate.toISOString(),
    notes: application.notes,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}
