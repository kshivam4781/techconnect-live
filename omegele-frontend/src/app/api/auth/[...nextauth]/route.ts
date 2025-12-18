import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions = {
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

        // 1) Ensure we have or create a User (keyed by email when available)
        const user =
          (email &&
            (await prisma.user.upsert({
              where: { email },
              create: { email, name, image },
              update: { name, image },
            }))) ||
          // Fallback: create a user without email (rare, but future‑proof)
          (await prisma.user.create({
            data: { email: email ?? null, name, image },
          }));

        // 2) Ensure we have an Account record for this provider+accountId
        const providerAccountId =
          (account as any).providerAccountId ?? (account as any).id;

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId,
            },
          },
          create: {
            provider: account.provider,
            providerAccountId,
            userId: user.id,
          },
          update: {
            userId: user.id,
          },
        });

        token.userId = user.id;
        token.provider = account.provider;
        token.providerAccountId = providerAccountId;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session as any).userId = token.userId;
        (session as any).provider = token.provider;
        (session as any).providerAccountId = token.providerAccountId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
