import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Discord({ clientId: process.env.DISCORD_CLIENT_ID!, clientSecret: process.env.DISCORD_CLIENT_SECRET! })],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      const discordId = (profile as any).id as string;
      const email = (profile as any).email as string | undefined;
      await prisma.user.upsert({ where: { discordId }, update: { email }, create: { discordId, email } });
      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const discordId = (profile as any).id as string;
        const u = await prisma.user.findUnique({ where: { discordId } });
        if (u) { (token as any).userId = u.id; (token as any).role = u.role; (token as any).discordId = u.discordId; }
      } else if ((token as any).discordId) {
        const u = await prisma.user.findUnique({ where: { discordId: (token as any).discordId as string } });
        if (u) { (token as any).userId = u.id; (token as any).role = u.role; }
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = (token as any).userId;
      (session as any).user.role = (token as any).role;
      (session as any).user.discordId = (token as any).discordId;
      return session;
    }
  }
});