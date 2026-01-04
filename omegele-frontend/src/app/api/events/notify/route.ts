import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/events/notify - Subscribe to event notifications
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
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

    // Check if email already exists
    const existing = await prisma.eventNotification.findUnique({
      where: { email },
    });

    if (existing) {
      // If exists but unsubscribed, reactivate
      if (!existing.isActive) {
        await prisma.eventNotification.update({
          where: { email },
          data: {
            name,
            isActive: true,
            unsubscribedAt: null,
            updatedAt: new Date(),
          },
        });
        return NextResponse.json({
          success: true,
          message: "Successfully resubscribed to event notifications",
        });
      } else {
        // Already subscribed, just update name if different
        if (existing.name !== name) {
          await prisma.eventNotification.update({
            where: { email },
            data: { name, updatedAt: new Date() },
          });
        }
        return NextResponse.json({
          success: true,
          message: "You're already subscribed to event notifications",
        });
      }
    }

    // Create new subscription
    await prisma.eventNotification.create({
      data: {
        name,
        email,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to event notifications",
    });
  } catch (error: any) {
    console.error("Error subscribing to event notifications:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to event notifications" },
      { status: 500 }
    );
  }
}

// GET /api/events/notify - Get all active subscribers (admin only - optional)
export async function GET() {
  try {
    const subscribers = await prisma.eventNotification.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Error fetching event notification subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

