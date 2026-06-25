import { z } from "zod";

export const JOB_TYPES = ["Internship", "FullTime", "PartTime"] as const;
export const APPLICATION_STATUSES = [
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Display labels for enum values */
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  Internship: "Internship",
  FullTime: "Full-time",
  PartTime: "Part-time",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  Applied: "Applied",
  Interviewing: "Interviewing",
  Offer: "Offer",
  Rejected: "Rejected",
};

export const createApplicationSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(150, "Job title must be at most 150 characters"),
  jobType: z.enum(JOB_TYPES, {
    errorMap: () => ({ message: "Please select a valid job type" }),
  }),
  status: z.enum(APPLICATION_STATUSES, {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
  appliedDate: z.coerce.date({
    errorMap: () => ({ message: "Applied date is required" }),
  }),
  notes: z
    .string()
    .max(1000, "Notes must be at most 1000 characters")
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),
});

/** Form schema — keeps appliedDate as string for HTML date inputs */
export const applicationFormSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(150, "Job title must be at most 150 characters"),
  jobType: z.enum(JOB_TYPES, {
    errorMap: () => ({ message: "Please select a valid job type" }),
  }),
  status: z.enum(APPLICATION_STATUSES, {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
  appliedDate: z.string().min(1, "Applied date is required"),
  notes: z
    .string()
    .max(1000, "Notes must be at most 1000 characters")
    .optional(),
});

export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;

export const updateApplicationSchema = createApplicationSchema.partial();

export const queryApplicationsSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type QueryApplicationsInput = z.infer<typeof queryApplicationsSchema>;

export function parseQueryParams(
  searchParams: URLSearchParams
): QueryApplicationsInput {
  const raw = {
    status: searchParams.get("status") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? "1",
    limit: searchParams.get("limit") ?? "10",
  };

  return queryApplicationsSchema.parse(raw);
}

export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "root";
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }
  return formatted;
}
