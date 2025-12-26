import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).userId;
    
    // Get current user with their accounts
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract email domain if available
    const emailDomain = currentUser.email?.split("@")[1];

    // Get user's topics
    const userTopics = currentUser.topics || [];

    // Check current user's providers (once, outside the loop)
    const currentUserHasLinkedIn = currentUser.accounts.some(
      (acc) => acc.provider === "linkedin"
    );
    const currentUserHasGitHub = currentUser.accounts.some(
      (acc) => acc.provider === "github"
    );

    // Find users who might be connections
    const potentialConnections = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } }, // Not the current user
          { isBlocked: false }, // Not blocked
          { onboarded: true }, // Onboarded
          { termsAcceptedAt: { not: null } }, // Accepted terms
        ],
      },
      include: {
        accounts: true, // Include all accounts (LinkedIn and GitHub)
        activities: {
          orderBy: {
            lastSeen: "desc",
          },
          take: 1,
        },
      },
      take: 20, // Get more candidates to score and filter
    });

    // Score and rank potential connections
    const scoredConnections = potentialConnections
      .map((user) => {
        let score = 0;
        const reasons: string[] = [];

        // Check if they have same provider account (LinkedIn or GitHub)
        const hasLinkedIn = user.accounts.some((acc) => acc.provider === "linkedin");
        const hasGitHub = user.accounts.some((acc) => acc.provider === "github");

        // Bonus for same provider
        if (hasLinkedIn && currentUserHasLinkedIn) {
          score += 30;
          reasons.push("LinkedIn verified");
        } else if (hasGitHub && currentUserHasGitHub) {
          score += 25;
          reasons.push("GitHub verified");
        } else if (hasLinkedIn || hasGitHub) {
          // Still give some points for verified accounts
          score += 10;
          reasons.push("Verified account");
        }

        // Check email domain match (same company)
        if (emailDomain && user.email?.endsWith(`@${emailDomain}`)) {
          score += 50;
          reasons.push("Same company");
        }

        // Check topic overlap
        if (userTopics.length > 0 && user.topics.length > 0) {
          const commonTopics = userTopics.filter((topic) =>
            user.topics.includes(topic)
          );
          if (commonTopics.length > 0) {
            score += commonTopics.length * 10;
            reasons.push(`${commonTopics.length} shared interest${commonTopics.length > 1 ? "s" : ""}`);
          }
        }

        // Check if they're currently online
        if (user.activities.length > 0) {
          score += 20;
          reasons.push("Online now");
        }

        // Check seniority match (bonus points)
        if (currentUser.seniority && user.seniority === currentUser.seniority) {
          score += 15;
          reasons.push("Similar level");
        }

        // Check if recently active (within last 24 hours)
        const recentActivity = user.activities[0];
        if (recentActivity) {
          const hoursSinceActive =
            (Date.now() - new Date(recentActivity.lastSeen).getTime()) /
            (1000 * 60 * 60);
          if (hoursSinceActive < 24) {
            score += 10;
          }
        }

        return {
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
            email: user.email ? user.email.split("@")[0] + "@***" : null, // Partially hide email
            topics: user.topics,
            seniority: user.seniority,
            hasLinkedIn,
            hasGitHub,
            isOnline: user.activities.length > 0 && 
              (user.activities[0].status === "ONLINE" || user.activities[0].status === "SEARCHING"),
          },
          score,
          reasons,
        };
      })
      .filter((item) => item.score > 0) // Only show if there's some connection
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 6); // Top 6 suggestions

    return NextResponse.json({
      connections: scoredConnections,
      currentUser: {
        hasLinkedIn: currentUserHasLinkedIn,
        hasGitHub: currentUserHasGitHub,
        emailDomain: emailDomain ? `${emailDomain.split(".")[0]}***` : null, // Partially hide domain
      },
    });
  } catch (error: any) {
    console.error("Error fetching people you may know:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch suggestions",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

