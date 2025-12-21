import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const body = await request.json().catch(() => ({}));
    const { mode } = body as { mode?: "video" | "text" };

    // End any existing active sessions for this user
    await prisma.userSession.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });

    // Create new session
    const sessionId = randomUUID();
    const userSession = await prisma.userSession.create({
      data: {
        userId,
        sessionId,
        isActive: true,
        matchedUserIds: [],
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: userSession.sessionId,
      session: {
        id: userSession.id,
        sessionId: userSession.sessionId,
        startedAt: userSession.startedAt.toISOString(),
        isActive: userSession.isActive,
        matchedUserIds: userSession.matchedUserIds,
      },
    });
  } catch (error: any) {
    console.error("Error starting session:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to start session",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

