import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        // surface provider + id for later phases (linking, matching, etc.)
        (session as any).provider = token.provider;
        (session as any).providerAccountId = token.providerAccountId;
      }
      return session;
    },
    async jwt({ token, account }: any) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };


