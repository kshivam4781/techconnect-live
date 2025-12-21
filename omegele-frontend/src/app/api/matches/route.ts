import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const status = searchParams.get("status") as
      | "PENDING"
      | "ACTIVE"
      | "ENDED"
      | "SKIPPED"
      | "TIMEOUT"
      | null;

    // Build where clause
    const where: any = {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    };

    if (startTime) {
      where.matchedAt = { ...where.matchedAt, gte: new Date(startTime) };
    }

    if (endTime) {
      where.matchedAt = {
        ...where.matchedAt,
        lte: new Date(endTime),
      };
    }

    if (status) {
      where.status = status;
    }

    // Fetch matches
    const matches = await prisma.match.findMany({
      where,
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        matchedAt: "desc",
      },
      take: 100, // Limit to 100 matches
    });

    const total = await prisma.match.count({ where });

    return NextResponse.json({
      matches: matches.map((match) => ({
        id: match.id,
        user1Id: match.user1Id,
        user2Id: match.user2Id,
        user1: match.user1,
        user2: match.user2,
        mode: match.mode,
        status: match.status,
        matchedAt: match.matchedAt.toISOString(),
        startedAt: match.startedAt?.toISOString() || null,
        endedAt: match.endedAt?.toISOString() || null,
        duration: match.duration,
        matchedTopics: match.matchedTopics,
      })),
      total,
      timeRange: {
        start: startTime || null,
        end: endTime || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch matches",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

