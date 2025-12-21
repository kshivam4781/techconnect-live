import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { flagId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const { flagId } = params;
    const body = await request.json();
    const { reason, category, status, adminNotes } = body as {
      reason?: string;
      category?: string;
      status?: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
      adminNotes?: string;
    };

    // Find the flag
    const flag = await (prisma as any).flag.findUnique({
      where: { id: flagId },
    });

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 });
    }

    // Users can only update their own flags (for adding reason/category)
    // Admins can update status and adminNotes (for now, we'll allow the creator to update)
    if (flag.flaggedById !== userId) {
      return NextResponse.json(
        { error: "You can only update flags you created" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (reason !== undefined) {
      updateData.reason = reason;
    }
    if (category !== undefined) {
      updateData.category = category;
    }
    // Only allow status/adminNotes updates if user is admin (for now, skip this check)
    // In production, you'd check if user is admin
    if (status !== undefined) {
      updateData.status = status;
      if (status !== "PENDING") {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = userId;
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

