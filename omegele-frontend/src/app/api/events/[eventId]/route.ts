import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events/[eventId] - Get a single event
export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
      include: {
        registrations: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const eventWithCount = {
      ...event,
      registrationCount: event.registrations.length,
      registrations: undefined, // Remove registrations array from response
    };

    return NextResponse.json({ event: eventWithCount });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

