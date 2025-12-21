import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const { matchId } = params;

    // Fetch match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
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
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Verify user is part of this match
    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      match: {
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
        user1JoinedAt: match.user1JoinedAt?.toISOString() || null,
        user2JoinedAt: match.user2JoinedAt?.toISOString() || null,
        roomId: match.roomId,
      },
    });
  } catch (error: any) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch match",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

