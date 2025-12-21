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

    const { searchParams } = new URL(request.url);
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    // Build where clause
    const where: any = {};
    if (startTime || endTime) {
      where.matchedAt = {};
      if (startTime) {
        where.matchedAt.gte = new Date(startTime);
      }
      if (endTime) {
        where.matchedAt.lte = new Date(endTime);
      }
    }

    // Get total matches
    const totalMatches = await prisma.match.count({ where });

    // Get active matches
    const activeMatches = await prisma.match.count({
      where: { ...where, status: "ACTIVE" },
    });

    // Get ended matches
    const endedMatches = await prisma.match.count({
      where: { ...where, status: "ENDED" },
    });

    // Get average duration
    const endedMatchesWithDuration = await prisma.match.findMany({
      where: {
        ...where,
        status: "ENDED",
        duration: { not: null },
      },
      select: {
        duration: true,
      },
    });

    const averageDuration =
      endedMatchesWithDuration.length > 0
        ? endedMatchesWithDuration.reduce(
            (sum, m) => sum + (m.duration || 0),
            0
          ) / endedMatchesWithDuration.length
        : 0;

    // Get matches by mode
    const videoMatches = await prisma.match.count({
      where: { ...where, mode: "VIDEO" },
    });

    const textMatches = await prisma.match.count({
      where: { ...where, mode: "TEXT" },
    });

    // Get matches by time range (grouped by hour)
    const matchesByTimeRange = await prisma.match.groupBy({
      by: ["matchedAt"],
      where,
      _count: true,
    });

    return NextResponse.json({
      totalMatches,
      activeMatches,
      endedMatches,
      averageDuration: Math.round(averageDuration),
      matchesByMode: {
        VIDEO: videoMatches,
        TEXT: textMatches,
      },
      matchesByTimeRange: matchesByTimeRange.map((m) => ({
        time: m.matchedAt.toISOString(),
        count: m._count,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching match stats:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch match stats",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

