import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/flags
 * Get all flags for admin review
 * Note: In production, add proper admin role checking
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check in production
    // const user = await prisma.user.findUnique({ where: { id: (session as any).userId } });
    // if (!user || user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as
      | "PENDING"
      | "REVIEWED"
      | "RESOLVED"
      | "DISMISSED"
      | null;
    const flaggedUserId = searchParams.get("flaggedUserId");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (flaggedUserId) {
      where.flaggedUserId = flaggedUserId;
    }

    const flags = await (prisma as any).flag.findMany({
      where,
      include: {
        flaggedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        flaggedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            flagCount: true,
            isBlocked: true,
          },
        },
        match: {
          select: {
            id: true,
            matchedAt: true,
            status: true,
          },
        },
      },
      orderBy: {
        flaggedAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({
      flags: flags.map((flag: any) => ({
        id: flag.id,
        flaggedById: flag.flaggedById,
        flaggedBy: flag.flaggedBy,
        flaggedUserId: flag.flaggedUserId,
        flaggedUser: flag.flaggedUser,
        matchId: flag.matchId,
        match: flag.match,
        reason: flag.reason,
        category: flag.category,
        flaggedAt: flag.flaggedAt.toISOString(),
        status: flag.status,
        reviewedAt: flag.reviewedAt?.toISOString() || null,
        reviewedBy: flag.reviewedBy,
        adminNotes: flag.adminNotes,
      })),
      total: flags.length,
    });
  } catch (error: any) {
    console.error("Error fetching flags:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch flags",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

