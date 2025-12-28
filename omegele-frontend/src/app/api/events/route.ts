import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events - Get all events (upcoming and past)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // "upcoming" | "past" | null (all)

    const now = new Date();

    let whereClause: any = {
      isActive: true,
    };

    if (filter === "upcoming") {
      whereClause.eventDate = {
        gte: now,
      };
    } else if (filter === "past") {
      whereClause.eventDate = {
        lt: now,
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        eventDate: "asc",
      },
      include: {
        registrations: {
          select: {
            id: true,
          },
        },
      },
    });

    // Add registration count
    const eventsWithCounts = events.map((event) => ({
      ...event,
      registrationCount: event.registrations.length,
      registrations: undefined, // Remove registrations array from response
    }));

    return NextResponse.json({ events: eventsWithCounts });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

