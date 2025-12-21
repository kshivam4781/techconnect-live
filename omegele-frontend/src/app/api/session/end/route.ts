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
    const body = await request.json().catch(() => ({}));
    const { sessionId } = body as { sessionId?: string };

    // If sessionId provided, end that specific session
    // Otherwise, end all active sessions for this user
    if (sessionId) {
      const userSession = await prisma.userSession.findFirst({
        where: {
          userId,
          sessionId,
          isActive: true,
        },
      });

      if (!userSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      await prisma.userSession.update({
        where: { id: userSession.id },
        data: {
          isActive: false,
          endedAt: new Date(),
        },
      });
    } else {
      // End all active sessions
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
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error ending session:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to end session",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

