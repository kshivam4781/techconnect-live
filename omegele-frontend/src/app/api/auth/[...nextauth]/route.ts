import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      // On initial sign-in, upsert the user and their provider account
      if (account && profile) {
        try {
          const email = (profile.email || token.email) as string | undefined;
          const name =
            (profile.name as string | undefined) ||
            (profile.login as string | undefined) ||
            (token.name as string | undefined) ||
            null;
          const image =
            (profile.avatar_url as string | undefined) ||
            (token.picture as string | undefined) ||
            null;

          // Get the provider account ID correctly
          const providerAccountId = account.providerAccountId || String(account.id);

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
            await prisma.account.create({
              data: {
                provider: account.provider,
                providerAccountId,
                userId: user.id,
              },
            });
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
          });
          // Re-throw with more context for debugging
          throw error;
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
