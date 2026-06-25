"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationFormSchema,
  JOB_TYPES,
  APPLICATION_STATUSES,
  JOB_TYPE_LABELS,
  STATUS_LABELS,
  type CreateApplicationInput,
  type ApplicationFormInput,
} from "@/lib/validations";
import { toDateInputValue } from "@/lib/utils";
import type { ApplicationDTO } from "@/types/application";

export interface ApplicationFormValues extends ApplicationFormInput {}

interface ApplicationFormProps {
  defaultValues?: ApplicationDTO;
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

function toFormValues(application?: ApplicationDTO): ApplicationFormValues {
  if (application) {
    return {
      companyName: application.companyName,
      jobTitle: application.jobTitle,
      jobType: application.jobType,
      status: application.status,
      appliedDate: toDateInputValue(application.appliedDate),
      notes: application.notes ?? "",
    };
  }

  return {
    companyName: "",
    jobTitle: "",
    jobType: "Internship",
    status: "Applied",
    appliedDate: toDateInputValue(new Date()),
    notes: "",
  };
}

export function ApplicationForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Application",
  isSubmitting = false,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: toFormValues(defaultValues),
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit({
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      status: data.status,
      appliedDate: data.appliedDate,
      notes: data.notes || undefined,
    });
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          placeholder="e.g. Acme Corp"
          aria-invalid={!!errors.companyName}
          aria-describedby={
            errors.companyName ? "companyName-error" : undefined
          }
          {...register("companyName")}
        />
        {errors.companyName && (
          <p id="companyName-error" className="text-sm text-destructive">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title *</Label>
        <Input
          id="jobTitle"
          placeholder="e.g. Software Engineering Intern"
          aria-invalid={!!errors.jobTitle}
          aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
          {...register("jobTitle")}
        />
        {errors.jobTitle && (
          <p id="jobTitle-error" className="text-sm text-destructive">
            {errors.jobTitle.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="jobType">Job Type *</Label>
          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="jobType" aria-label="Job type">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {JOB_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.jobType && (
            <p className="text-sm text-destructive">{errors.jobType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" aria-label="Application status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appliedDate">Applied Date *</Label>
        <Input
          id="appliedDate"
          type="date"
          aria-invalid={!!errors.appliedDate}
          aria-describedby={
            errors.appliedDate ? "appliedDate-error" : undefined
          }
          {...register("appliedDate")}
        />
        {errors.appliedDate && (
          <p id="appliedDate-error" className="text-sm text-destructive">
            {errors.appliedDate.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Optional notes about this application..."
          rows={3}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
