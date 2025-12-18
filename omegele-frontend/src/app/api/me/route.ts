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
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { topics, seniority, timezone, goals } = body as {
    topics?: string[];
    seniority?: string | null;
    timezone?: string | null;
    goals?: string | null;
  };

  const user = await prisma.user.update({
    where: { id: (session as any).userId },
    data: {
      topics: topics ?? undefined,
      seniority: seniority
        ? (seniority.toUpperCase().replace("-", "_") as any)
        : undefined,
      timezone: timezone ?? undefined,
      goals: goals ?? undefined,
      onboarded: true,
    },
  });

  return NextResponse.json({ user });
}


