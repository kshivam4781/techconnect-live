import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total registered users count
    const totalRegisteredUsers = await prisma.user.count().catch(() => 0);

    // Get all recent activities (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    let activities = [];
    try {
      activities = await prisma.userActivity.findMany({
        where: {
          lastSeen: {
            gte: fiveMinutesAgo,
          },
        },
      });
    } catch (activityError: any) {
      // If the table doesn't exist or there's an error, log it but continue with empty array
      console.warn("Error fetching user activities (table may not exist):", activityError.message);
      activities = [];
    }

    // Count by status
    const online = activities.filter((a) => a.status === "ONLINE").length;
    const searching = activities.filter((a) => a.status === "SEARCHING").length;
    const inCall = activities.filter((a) => a.status === "IN_CALL").length;
    
    // Calculate totals
    const totalOnline = online + searching + inCall; // All users who are online (any status)
    const totalActive = searching + inCall; // Users who are actively searching or in a call

    // Count by mode
    const videoCount = activities.filter(
      (a) => a.status === "SEARCHING" && a.mode === "VIDEO"
    ).length;
    const textCount = activities.filter(
      (a) => a.status === "SEARCHING" && a.mode === "TEXT"
    ).length;

    return NextResponse.json({
      totalRegisteredUsers,
      totalOnline, // All users online (ONLINE + SEARCHING + IN_CALL)
      totalActive, // Users actively searching or in call (SEARCHING + IN_CALL)
      online, // Users just browsing (ONLINE status)
      searching, // Users searching for a match
      inCall, // Users in an active call
      breakdown: {
        video: videoCount,
        text: textCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching activity stats:", error);
    // Return default values instead of error to prevent UI breakage
    return NextResponse.json({
      totalRegisteredUsers: 0,
      totalOnline: 0,
      totalActive: 0,
      online: 0,
      searching: 0,
      inCall: 0,
      breakdown: {
        video: 0,
        text: 0,
      },
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

