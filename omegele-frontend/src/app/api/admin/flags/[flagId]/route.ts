import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/admin/flags/[flagId]
 * Update flag status (expert team action)
 * Note: In production, add proper admin role checking
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ flagId: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check in production
    // const adminUser = await prisma.user.findUnique({ where: { id: (session as any).userId } });
    // if (!adminUser || adminUser.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { flagId } = await params;
    const body = await request.json();
    const { status, adminNotes } = body as {
      status?: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
      adminNotes?: string;
    };

    const flag = await (prisma as any).flag.findUnique({
      where: { id: flagId },
    });

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status !== "PENDING") {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = (session as any).userId;
      }
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const updatedFlag = await (prisma as any).flag.update({
      where: { id: flagId },
      data: updateData,
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
      },
    });

    return NextResponse.json({
      success: true,
      flag: {
        id: updatedFlag.id,
        flaggedById: updatedFlag.flaggedById,
        flaggedBy: updatedFlag.flaggedBy,
        flaggedUserId: updatedFlag.flaggedUserId,
        flaggedUser: updatedFlag.flaggedUser,
        matchId: updatedFlag.matchId,
        reason: updatedFlag.reason,
        category: updatedFlag.category,
        flaggedAt: updatedFlag.flaggedAt.toISOString(),
        status: updatedFlag.status,
        reviewedAt: updatedFlag.reviewedAt?.toISOString() || null,
        reviewedBy: updatedFlag.reviewedBy,
        adminNotes: updatedFlag.adminNotes,
      },
    });
  } catch (error: any) {
    console.error("Error updating flag:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update flag",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

