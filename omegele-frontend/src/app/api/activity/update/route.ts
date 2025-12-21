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
    const { status, mode } = body as {
      status: "ONLINE" | "SEARCHING" | "IN_CALL" | "OFFLINE";
      mode?: "VIDEO" | "TEXT";
    };

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Find the most recent activity for this user, or create a new one
    const existingActivity = await prisma.userActivity.findFirst({
      where: { userId },
      orderBy: { lastSeen: "desc" },
    });

    if (existingActivity) {
      // Update existing activity
      await prisma.userActivity.update({
        where: { id: existingActivity.id },
        data: {
          status,
          mode: mode || null,
          lastSeen: new Date(),
        },
      });
    } else {
      // Create new activity record
      await prisma.userActivity.create({
        data: {
          userId,
          status,
          mode: mode || null,
          lastSeen: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update activity",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

