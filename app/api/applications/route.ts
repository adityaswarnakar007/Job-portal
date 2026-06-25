import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createApplicationSchema,
  parseQueryParams,
  formatZodErrors,
} from "@/lib/validations";
import { toApplicationDTO } from "@/types/application";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { status, search, page, limit } = parseQueryParams(searchParams);

    const where: Prisma.ApplicationWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { companyName: { contains: term, mode: "insensitive" } },
        { jobTitle: { contains: term, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { appliedDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({
      data: applications.map(toApplicationDTO),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: formatZodErrors(error) },
        { status: 400 }
      );
    }
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createApplicationSchema.parse(body);

    const application = await prisma.application.create({
      data: {
        companyName: parsed.companyName,
        jobTitle: parsed.jobTitle,
        jobType: parsed.jobType,
        status: parsed.status,
        appliedDate: parsed.appliedDate,
        notes: parsed.notes ?? null,
      },
    });

    return NextResponse.json(toApplicationDTO(application), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: formatZodErrors(error) },
        { status: 400 }
      );
    }
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
