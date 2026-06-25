import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { updateApplicationSchema, formatZodErrors } from "@/lib/validations";
import { toApplicationDTO } from "@/types/application";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = context.params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(toApplicationDTO(application));
  } catch (error) {
    console.error("GET /api/applications/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = context.params;
    const body: unknown = await request.json();
    const parsed = updateApplicationSchema.parse(body);

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(parsed.companyName !== undefined && {
          companyName: parsed.companyName,
        }),
        ...(parsed.jobTitle !== undefined && { jobTitle: parsed.jobTitle }),
        ...(parsed.jobType !== undefined && { jobType: parsed.jobType }),
        ...(parsed.status !== undefined && { status: parsed.status }),
        ...(parsed.appliedDate !== undefined && {
          appliedDate: parsed.appliedDate,
        }),
        ...(parsed.notes !== undefined && { notes: parsed.notes ?? null }),
      },
    });

    return NextResponse.json(toApplicationDTO(application));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: formatZodErrors(error) },
        { status: 400 }
      );
    }
    console.error("PATCH /api/applications/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = context.params;

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await prisma.application.delete({ where: { id } });

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/applications/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
