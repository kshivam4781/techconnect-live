import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST /api/events/[eventId]/register - Register for an event
export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { firstName, lastName, email } = body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is in the past
    if (event.eventDate < new Date()) {
      return NextResponse.json(
        { error: "Cannot register for past events" },
        { status: 400 }
      );
    }

    // Check if event is active
    if (!event.isActive) {
      return NextResponse.json(
        { error: "Event is not active" },
        { status: 400 }
      );
    }

    // Check max attendees if set
    if (event.maxAttendees) {
      const registrationCount = await prisma.eventRegistration.count({
        where: {
          eventId: params.eventId,
        },
      });

      if (registrationCount >= event.maxAttendees) {
        return NextResponse.json(
          { error: "Event is full" },
          { status: 400 }
        );
      }
    }

    // Get userId from session (NextAuth stores it as userId)
    const userId = (session as any)?.userId || null;

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId: params.eventId,
        OR: [
          ...(userId ? [{ userId }] : []),
          { email },
        ],
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: params.eventId,
        userId,
        firstName,
        lastName,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error: any) {
    console.error("Error registering for event:", error);
    
    // Handle unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}

