import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/events/[eventId]/check-registration - Check if user is registered
export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Get userId from session (NextAuth stores it as userId)
    const userId = (session as any)?.userId || null;

    if (!userId && !email) {
      return NextResponse.json({ isRegistered: false });
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });

    return NextResponse.json({
      isRegistered: !!registration,
    });
  } catch (error) {
    console.error("Error checking registration:", error);
    return NextResponse.json(
      { error: "Failed to check registration" },
      { status: 500 }
    );
  }
}

