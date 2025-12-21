import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const accountCount = await prisma.account.count();

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { accounts: true },
    });

    return NextResponse.json({
      success: true,
      database: "connected",
      counts: {
        users: userCount,
        accounts: accountCount,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        accounts: u.accounts.map((a) => ({
          provider: a.provider,
          providerAccountId: a.providerAccountId,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

