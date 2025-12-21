import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canUserSearch } from "@/lib/user-utils";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const userId = (session as any).userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Check if user can search
  const searchCheck = await canUserSearch(userId);

  return NextResponse.json({
    user,
    flagStatus: {
      canSearch: searchCheck.canSearch,
      flagCount: searchCheck.flagCount,
      isBlocked: searchCheck.isBlocked,
      reason: searchCheck.reason,
    },
  });
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topics, seniority, goals, initialConversationDuration, showName } = body as {
      topics?: string[];
      seniority?: string | null;
      goals?: string | null;
      initialConversationDuration?: number | null;
      showName?: boolean;
    };

    const user = await prisma.user.update({
      where: { id: (session as any).userId },
      data: {
        topics: topics ?? undefined,
        seniority: seniority
          ? (seniority.toUpperCase().replace(/-/g, "_") as any)
          : undefined,
        goals: goals ?? undefined,
        // Removed showName since it does not exist on the type
        onboarded: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update user",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}


