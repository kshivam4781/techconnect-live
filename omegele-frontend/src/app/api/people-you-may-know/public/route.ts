import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Public endpoint that returns anonymized statistics about users on the platform
 * This is safe to show to non-logged-in users to encourage signups
 */
export async function GET() {
  try {
    // Get total counts
    const totalUsers = await prisma.user.count({
      where: {
        isBlocked: false,
        onboarded: true,
        termsAcceptedAt: { not: null },
      },
    });

    // Count users by provider more efficiently
    const linkedInAccounts = await prisma.account.count({
      where: {
        provider: "linkedin",
        user: {
          isBlocked: false,
          onboarded: true,
          termsAcceptedAt: { not: null },
        },
      },
    });

    const githubAccounts = await prisma.account.count({
      where: {
        provider: "github",
        user: {
          isBlocked: false,
          onboarded: true,
          termsAcceptedAt: { not: null },
        },
      },
    });

    // Get unique company domains (sample for performance)
    const usersWithEmails = await prisma.user.findMany({
      where: {
        isBlocked: false,
        onboarded: true,
        termsAcceptedAt: { not: null },
        email: { not: null },
      },
      select: {
        email: true,
      },
      take: 500, // Sample size for performance
    });

    const companyDomains = new Set<string>();
    const personalEmailProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "protonmail.com"];

    usersWithEmails.forEach((user) => {
      if (user.email) {
        const domain = user.email.split("@")[1]?.toLowerCase();
        if (domain && !personalEmailProviders.includes(domain)) {
          // Only include business domains, not personal email providers
          companyDomains.add(domain);
        }
      }
    });

    // Get active users count
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeUsers = await prisma.userActivity.count({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo,
        },
        status: {
          in: ["ONLINE", "SEARCHING"],
        },
      },
    });

    // Get unique companies count (anonymized)
    const uniqueCompanies = companyDomains.size;

    // Get popular topics (anonymized)
    const usersWithTopics = await prisma.user.findMany({
      where: {
        isBlocked: false,
        onboarded: true,
        termsAcceptedAt: { not: null },
        topics: { isEmpty: false },
      },
      select: {
        topics: true,
      },
      take: 500, // Sample for performance
    });

    const topicCounts = new Map<string, number>();
    usersWithTopics.forEach((user) => {
      user.topics.forEach((topic) => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    // Get top 5 popular topics
    const popularTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    return NextResponse.json({
      stats: {
        totalUsers,
        linkedInUsers: linkedInAccounts,
        githubUsers: githubAccounts,
        activeUsers,
        uniqueCompanies,
        popularTopics,
      },
      // Anonymized messages for display
      messages: {
        linkedIn: linkedInAccounts > 0 
          ? `${linkedInAccounts}+ LinkedIn users are on the platform`
          : "LinkedIn professionals are joining",
        github: githubAccounts > 0
          ? `${githubAccounts}+ GitHub developers are here`
          : "GitHub developers are joining",
        companies: uniqueCompanies > 0
          ? `People from ${uniqueCompanies}+ companies are here`
          : "Professionals from various companies are joining",
        active: activeUsers > 0
          ? `${activeUsers} people are online now`
          : "People are connecting right now",
      },
    });
  } catch (error: any) {
    console.error("Error fetching public people stats:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch stats",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

