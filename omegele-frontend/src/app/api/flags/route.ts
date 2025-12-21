import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await request.json();
    const {
      flaggedUserId,
      matchId,
      reason,
      category,
    } = body as {
      flaggedUserId: string;
      matchId?: string;
      reason?: string;
      category?: string;
    };

    if (!flaggedUserId) {
      return NextResponse.json(
        { error: "flaggedUserId is required" },
        { status: 400 }
      );
    }

    // Prevent self-flagging
    if (flaggedUserId === userId) {
      return NextResponse.json(
        { error: "Cannot flag yourself" },
        { status: 400 }
      );
    }

    // If matchId is provided, verify the user is part of this match
    if (matchId) {
      const match = await (prisma as any).match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        return NextResponse.json(
          { error: "Match not found" },
          { status: 404 }
        );
      }

      if (match.user1Id !== userId && match.user2Id !== userId) {
        return NextResponse.json(
          { error: "You are not part of this match" },
          { status: 403 }
        );
      }

      if (match.user1Id !== flaggedUserId && match.user2Id !== flaggedUserId) {
        return NextResponse.json(
          { error: "Flagged user is not part of this match" },
          { status: 400 }
        );
      }
    }

    // Create flag (reason can be empty initially, will be updated later)
    const flag = await (prisma as any).flag.create({
      data: {
        flaggedById: userId,
        flaggedUserId,
        matchId: matchId || null,
        reason: reason || "", // Can be empty initially, updated when user submits reason
        category: category || null,
      },
    });

    return NextResponse.json({
      success: true,
      flag: {
        id: flag.id,
        flaggedById: flag.flaggedById,
        flaggedUserId: flag.flaggedUserId,
        matchId: flag.matchId,
        reason: flag.reason,
        category: flag.category,
        flaggedAt: flag.flaggedAt.toISOString(),
        status: flag.status,
      },
    });
  } catch (error: any) {
    console.error("Error creating flag:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create flag",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const { searchParams } = new URL(request.url);

    const matchId = searchParams.get("matchId");
    const status = searchParams.get("status") as
      | "PENDING"
      | "REVIEWED"
      | "RESOLVED"
      | "DISMISSED"
      | null;

    // Build where clause - users can only see flags they created or received
    const where: any = {
      OR: [{ flaggedById: userId }, { flaggedUserId: userId }],
    };

    if (matchId) {
      where.matchId = matchId;
    }

    if (status) {
      where.status = status;
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
          },
        },
      },
      orderBy: {
        flaggedAt: "desc",
      },
    });

    return NextResponse.json({
      flags: flags.map((flag: any) => ({
        id: flag.id,
        flaggedById: flag.flaggedById,
        flaggedBy: flag.flaggedBy,
        flaggedUserId: flag.flaggedUserId,
        flaggedUser: flag.flaggedUser,
        matchId: flag.matchId,
        reason: flag.reason,
        category: flag.category,
        flaggedAt: flag.flaggedAt.toISOString(),
        status: flag.status,
        reviewedAt: flag.reviewedAt?.toISOString() || null,
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

