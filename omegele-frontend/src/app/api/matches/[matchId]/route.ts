import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const { matchId } = await params;

    // Fetch match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            showName: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            showName: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Verify user is part of this match
    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      match: {
        id: match.id,
        user1Id: match.user1Id,
        user2Id: match.user2Id,
        user1: match.user1,
        user2: match.user2,
        mode: match.mode,
        status: match.status,
        matchedAt: match.matchedAt.toISOString(),
        startedAt: match.startedAt?.toISOString() || null,
        endedAt: match.endedAt?.toISOString() || null,
        duration: match.duration,
        matchedTopics: match.matchedTopics,
        user1JoinedAt: match.user1JoinedAt?.toISOString() || null,
        user2JoinedAt: match.user2JoinedAt?.toISOString() || null,
        roomId: match.roomId,
        user1Latitude: match.user1Latitude,
        user1Longitude: match.user1Longitude,
        user1Address: match.user1Address,
        user2Latitude: match.user2Latitude,
        user2Longitude: match.user2Longitude,
        user2Address: match.user2Address,
      },
    });
  } catch (error: any) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch match",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    const { matchId } = await params;
    const body = await request.json();

    // Fetch match to verify user is part of it
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Verify user is part of this match
    if (match.user1Id !== userId && match.user2Id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Determine which user this is (user1 or user2)
    const isUser1 = match.user1Id === userId;
    
    // Prepare update data
    const updateData: any = {};
    
    if (body.location) {
      const { latitude, longitude, address } = body.location;
      
      if (isUser1) {
        updateData.user1Latitude = latitude;
        updateData.user1Longitude = longitude;
        updateData.user1Address = address;
      } else {
        updateData.user2Latitude = latitude;
        updateData.user2Longitude = longitude;
        updateData.user2Address = address;
      }
    }

    // Update match with location data
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      match: {
        id: updatedMatch.id,
        user1Latitude: updatedMatch.user1Latitude,
        user1Longitude: updatedMatch.user1Longitude,
        user1Address: updatedMatch.user1Address,
        user2Latitude: updatedMatch.user2Latitude,
        user2Longitude: updatedMatch.user2Longitude,
        user2Address: updatedMatch.user2Address,
      },
    });
  } catch (error: any) {
    console.error("Error updating match location:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to update match location",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

