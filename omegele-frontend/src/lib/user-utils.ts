import { prisma } from "./prisma";

/**
 * Check if a user can start searching or connect on video call
 * Users are blocked if they have 5 or more flags or are manually blocked
 */
export async function canUserSearch(userId: string): Promise<{
  canSearch: boolean;
  reason?: string;
  flagCount: number;
  isBlocked: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      flagCount: true,
      isBlocked: true,
      blockedReason: true,
      blockedAt: true,
      termsAcceptedAt: true,
    },
  });

  if (!user) {
    return {
      canSearch: false,
      reason: "User not found",
      flagCount: 0,
      isBlocked: true,
    };
  }

  // Check if user has accepted terms and conditions
  if (!user.termsAcceptedAt) {
    return {
      canSearch: false,
      reason: "You must accept the Terms and Conditions before using this service. Please complete your onboarding and accept the terms.",
      flagCount: user.flagCount,
      isBlocked: false,
    };
  }

  // Check if user is manually blocked
  if (user.isBlocked) {
    return {
      canSearch: false,
      reason: user.blockedReason || "Your account has been blocked. Please contact support for assistance.",
      flagCount: user.flagCount,
      isBlocked: true,
    };
  }

  // Check if user has 5 or more flags
  if (user.flagCount >= 5) {
    return {
      canSearch: false,
      reason: `Your account has been temporarily suspended due to ${user.flagCount} flag(s). Our expert team will review your account. Please contact support for assistance.`,
      flagCount: user.flagCount,
      isBlocked: true,
    };
  }

  return {
    canSearch: true,
    flagCount: user.flagCount,
    isBlocked: false,
  };
}

