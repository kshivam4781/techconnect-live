import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Allow sign in - we'll handle user creation in JWT callback
      // This is just to log what we're receiving
      if (process.env.NODE_ENV === "development" && account?.provider === "linkedin") {
        console.log("LinkedIn signIn callback - account:", JSON.stringify(account, null, 2));
        console.log("LinkedIn signIn callback - profile:", JSON.stringify(profile, null, 2));
        console.log("LinkedIn signIn callback - user:", JSON.stringify(user, null, 2));
      }
      return true;
    },
    async jwt({ token, account, profile, user }: any) {
      // On initial sign-in, upsert the user and their provider account
      // Note: For some providers, profile might be undefined, so we check account
      if (account) {
        try {
          // Handle different profile structures for different providers
          let email: string | undefined;
          let name: string | null = null;
          let image: string | null = null;

          if (account.provider === "github") {
            // GitHub profile structure
            email = (profile?.email || token.email) as string | undefined;
            name =
              (profile?.name as string | undefined) ||
              (profile?.login as string | undefined) ||
              (token.name as string | undefined) ||
              null;
            image =
              (profile?.avatar_url as string | undefined) ||
              (token.picture as string | undefined) ||
              null;
          } else if (account.provider === "linkedin") {
            // LinkedIn profile structure - handle both OpenID Connect and legacy formats
            // Profile might be in token or profile object
            const linkedinProfile = profile || token;
            
            email = 
              (linkedinProfile?.email as string | undefined) ||
              (linkedinProfile?.emailAddress as string | undefined) ||
              token.email;
            
            // Try different possible name fields
            const firstName = 
              (linkedinProfile?.localizedFirstName as string | undefined) ||
              (linkedinProfile?.given_name as string | undefined) ||
              (linkedinProfile?.firstName as string | undefined) ||
              "";
            const lastName = 
              (linkedinProfile?.localizedLastName as string | undefined) ||
              (linkedinProfile?.family_name as string | undefined) ||
              (linkedinProfile?.lastName as string | undefined) ||
              "";
            
            name = firstName && lastName 
              ? `${firstName} ${lastName}`.trim()
              : (linkedinProfile?.name as string | undefined) || 
                (linkedinProfile?.displayName as string | undefined) ||
                token.name || 
                null;
            
            // Try different possible image fields
            image =
              (linkedinProfile?.profilePicture?.displayImage as string | undefined) ||
              (linkedinProfile?.picture as string | undefined) ||
              (linkedinProfile?.pictureUrl as string | undefined) ||
              (token.picture as string | undefined) ||
              null;
            
            // Log profile structure for debugging
            if (process.env.NODE_ENV === "development") {
              console.log("LinkedIn account:", JSON.stringify(account, null, 2));
              console.log("LinkedIn profile:", JSON.stringify(profile, null, 2));
              console.log("LinkedIn token:", JSON.stringify(token, null, 2));
            }
          } else {
            // Fallback for other providers
            email = (profile?.email || token.email) as string | undefined;
            name = (profile?.name as string | undefined) || token.name || null;
            image = (profile?.picture || token.picture) as string | undefined || null;
          }

          // Get the provider account ID correctly
          // LinkedIn uses 'sub' claim in OpenID Connect, which NextAuth maps to providerAccountId
          let providerAccountId: string | undefined = account.providerAccountId;
          
          // If providerAccountId is missing, try to get it from profile or account
          if (!providerAccountId || providerAccountId === "undefined" || providerAccountId === "null") {
            if (account.provider === "linkedin") {
              // Try multiple possible sources for LinkedIn ID
              providerAccountId = 
                (profile as any)?.sub || 
                (profile as any)?.id ||
                (token as any)?.sub ||
                (account as any)?.sub ||
                (account as any)?.id ||
                String(account.id || "");
            } else {
              providerAccountId = String(account.id || "");
            }
          }
          
          // Final fallback - generate a unique ID if still missing
          if (!providerAccountId || providerAccountId === "undefined" || providerAccountId === "null" || providerAccountId === "") {
            console.error("CRITICAL: providerAccountId is missing!", {
              provider: account.provider,
              account: JSON.stringify(account, null, 2),
              profile: profile ? JSON.stringify(profile, null, 2) : "No profile",
            });
            // Use a fallback - this shouldn't happen but prevents crash
            providerAccountId = `fallback_${account.provider}_${Date.now()}`;
          }
          
          // Ensure it's a string
          providerAccountId = String(providerAccountId);
          
          if (process.env.NODE_ENV === "development") {
            console.log("Provider account details:", {
              provider: account.provider,
              providerAccountId,
              accountId: account.id,
              hasProfile: !!profile,
              accountKeys: Object.keys(account),
              profileKeys: profile ? Object.keys(profile) : [],
            });
          }

          // 1) First, try to find or create the Account record
          // This will help us find the existing user if one exists
          let accountRecord = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId,
              },
            },
            include: { user: true },
          });

          let user;

          if (accountRecord) {
            // Account exists, use the existing user
            user = accountRecord.user;
            // Update user info if needed
            if (email || name || image) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  ...(email && { email }),
                  ...(name && { name }),
                  ...(image && { image }),
                },
              });
            }
          } else {
            // Account doesn't exist, create or find user
            if (email) {
              // Try to find user by email first
              user = await prisma.user.findUnique({
                where: { email },
              });

              if (user) {
                // User exists, update if needed
                if (name || image) {
                  user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      ...(name && { name }),
                      ...(image && { image }),
                    },
                  });
                }
              } else {
                // Create new user with email
                user = await prisma.user.create({
                  data: { email, name, image },
                });
              }
            } else {
              // No email, create new user
              user = await prisma.user.create({
                data: { email: null, name, image },
              });
            }

            // Create the Account record
            try {
              await prisma.account.create({
                data: {
                  provider: account.provider,
                  providerAccountId,
                  userId: user.id,
                },
              });
            } catch (dbError: any) {
              // If account already exists (race condition), find it
              if (dbError.code === "P2002") {
                accountRecord = await prisma.account.findUnique({
                  where: {
                    provider_providerAccountId: {
                      provider: account.provider,
                      providerAccountId,
                    },
                  },
                  include: { user: true },
                });
                if (accountRecord) {
                  user = accountRecord.user;
                } else {
                  throw dbError;
                }
              } else {
                throw dbError;
              }
            }
          }

          token.userId = user.id;
          token.provider = account.provider;
          token.providerAccountId = providerAccountId;
          token.onboarded = user.onboarded;
        } catch (error: any) {
          console.error("NextAuth JWT callback error:", error);
          console.error("Error details:", {
            message: error.message,
            code: error.code,
            meta: error.meta,
            provider: account?.provider,
            profile: profile ? JSON.stringify(profile, null, 2) : "No profile",
          });
          // Don't re-throw - return token with error flag to prevent redirect loop
          // The error will be caught by NextAuth and shown on error page
          throw new Error(`Authentication failed: ${error.message || "Unknown error"}`);
        }
      }

      // Refresh onboarded status on each request if we have userId
      if (token.userId && !account) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.userId as string },
            select: { onboarded: true },
          });
          if (user) {
            token.onboarded = user.onboarded;
          }
        } catch (error) {
          // Silently fail - don't break auth if DB query fails
          console.error("Error fetching onboarded status:", error);
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session as any).userId = token.userId;
        (session as any).provider = token.provider;
        (session as any).providerAccountId = token.providerAccountId;
        (session as any).onboarded = token.onboarded;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
