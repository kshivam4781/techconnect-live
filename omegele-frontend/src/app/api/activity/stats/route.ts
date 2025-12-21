import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all recent activities (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const activities = await prisma.userActivity.findMany({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Count by status
    const totalOnline = activities.filter((a) => a.status === "ONLINE").length;
    const searching = activities.filter((a) => a.status === "SEARCHING").length;
    const inCall = activities.filter((a) => a.status === "IN_CALL").length;

    // Count by mode
    const videoCount = activities.filter(
      (a) => a.status === "SEARCHING" && a.mode === "VIDEO"
    ).length;
    const textCount = activities.filter(
      (a) => a.status === "SEARCHING" && a.mode === "TEXT"
    ).length;

    return NextResponse.json({
      totalOnline,
      searching,
      inCall,
      breakdown: {
        video: videoCount,
        text: textCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching activity stats:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch activity stats",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

