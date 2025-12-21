import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: (session as any).userId },
  });

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topics, seniority, goals } = body as {
      topics?: string[];
      seniority?: string | null;
      goals?: string | null;
    };

    const user = await prisma.user.update({
      where: { id: (session as any).userId },
      data: {
        topics: topics ?? undefined,
        seniority: seniority
          ? (seniority.toUpperCase().replace(/-/g, "_") as any)
          : undefined,
        goals: goals ?? undefined,
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


