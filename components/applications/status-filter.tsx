"use client";

import { Button } from "@/components/ui/button";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

export type StatusFilterValue = ApplicationStatus | "all";

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

const filterOptions: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...APPLICATION_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter by status"
    >
      {filterOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.value)}
          className={cn(
            "transition-colors",
            value === option.value && "shadow-sm"
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
