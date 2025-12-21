import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    const userId = (session as any).userId;

    // Find the current active session
    const userSession = await prisma.userSession.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    if (!userSession) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    // Count matches in this session
    const matchCount = await prisma.match.count({
      where: {
        OR: [
          { user1SessionId: userSession.sessionId },
          { user2SessionId: userSession.sessionId },
        ],
      },
    });

    return NextResponse.json({
      session: {
        id: userSession.id,
        sessionId: userSession.sessionId,
        startedAt: userSession.startedAt.toISOString(),
        isActive: userSession.isActive,
        matchedUserIds: userSession.matchedUserIds,
        matchCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching current session:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch session",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

