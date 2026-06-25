import { describe, it, expect } from "vitest";
import {
  createApplicationSchema,
  updateApplicationSchema,
  queryApplicationsSchema,
  formatZodErrors,
} from "@/lib/validations";

describe("createApplicationSchema", () => {
  const validInput = {
    companyName: "Acme Corp",
    jobTitle: "Software Engineering Intern",
    jobType: "Internship" as const,
    status: "Applied" as const,
    appliedDate: "2024-06-15",
    notes: "Found via LinkedIn",
  };

  it("accepts valid application data", () => {
    const result = createApplicationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.companyName).toBe("Acme Corp");
      expect(result.data.appliedDate).toBeInstanceOf(Date);
    }
  });

  it("rejects company name shorter than 2 characters", () => {
    const result = createApplicationSchema.safeParse({
      ...validInput,
      companyName: "A",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      expect(errors.companyName).toContain(
        "Company name must be at least 2 characters"
      );
    }
  });

  it("rejects empty job title", () => {
    const result = createApplicationSchema.safeParse({
      ...validInput,
      jobTitle: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid job type", () => {
    const result = createApplicationSchema.safeParse({
      ...validInput,
      jobType: "Contract",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = createApplicationSchema.safeParse({
      ...validInput,
      status: "Pending",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional notes to be omitted", () => {
    const { notes: _notes, ...withoutNotes } = validInput;
    const result = createApplicationSchema.safeParse(withoutNotes);
    expect(result.success).toBe(true);
  });
});

describe("updateApplicationSchema", () => {
  it("allows partial updates", () => {
    const result = updateApplicationSchema.safeParse({
      status: "Interviewing",
    });
    expect(result.success).toBe(true);
  });

  it("still validates provided fields", () => {
    const result = updateApplicationSchema.safeParse({
      companyName: "X",
    });
    expect(result.success).toBe(false);
  });
});

describe("queryApplicationsSchema", () => {
  it("applies defaults for page and limit", () => {
    const result = queryApplicationsSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("accepts valid status filter", () => {
    const result = queryApplicationsSchema.safeParse({ status: "Offer" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid page number", () => {
    const result = queryApplicationsSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });
});

describe("formatZodErrors", () => {
  it("groups errors by field path", () => {
    const result = createApplicationSchema.safeParse({
      companyName: "A",
      jobTitle: "",
      jobType: "Internship",
      status: "Applied",
      appliedDate: "2024-06-15",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      expect(errors.companyName).toBeDefined();
      expect(errors.jobTitle).toBeDefined();
    }
  });
});
