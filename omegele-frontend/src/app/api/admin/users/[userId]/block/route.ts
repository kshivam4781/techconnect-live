import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/users/[userId]/block
 * Block a user (expert team action)
 * Note: In production, add proper admin role checking
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check in production
    // const adminUser = await prisma.user.findUnique({ where: { id: (session as any).userId } });
    // if (!adminUser || adminUser.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { userId } = await params;
    const body = await request.json();
    const { reason, permanent } = body as {
      reason?: string;
      permanent?: boolean;
    };

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Block the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason || "Blocked by admin",
        blockedBy: (session as any).userId,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        flagCount: updatedUser.flagCount,
        isBlocked: updatedUser.isBlocked,
        blockedAt: updatedUser.blockedAt?.toISOString(),
        blockedReason: updatedUser.blockedReason,
      },
    });
  } catch (error: any) {
    console.error("Error blocking user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to block user",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[userId]/block
 * Unblock a user (expert team action)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin role check in production

    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Unblock the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: false,
        blockedAt: null,
        blockedReason: null,
        blockedBy: null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        flagCount: updatedUser.flagCount,
        isBlocked: updatedUser.isBlocked,
      },
    });
  } catch (error: any) {
    console.error("Error unblocking user:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to unblock user",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

