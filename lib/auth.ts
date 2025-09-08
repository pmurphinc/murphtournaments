// lib/auth.ts
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,

      // Ask Discord for email (helps account linking)
      authorization: { params: { scope: "identify email" } },

      // Avoid “AccessDenied” when Discord doesn't return/verify an email
      allowDangerousEmailAccountLinking: true,

      // Provide safe defaults for profile fields
      profile(profile) {
        return {
          id: profile.id,
          name: (profile as any).global_name ?? profile.username ?? `discord_${profile.id}`,
          email: (profile as any).email ?? null,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
        };
      },
    }),
  ],

  callbacks: {
    // Never block sign-in; just log and continue
    async signIn({ profile }) {
      try {
        if (!profile) return true;
        const discordId = String((profile as any).id);
        await prisma.user.upsert({
          where: { discordId },
          update: {},
          create: { discordId },
        });
        return true;
      } catch (err) {
        console.error("NextAuth signIn upsert error:", err);
        return true;
      }
    },

    async jwt({ token, profile }) {
      try {
        if (profile) {
          const discordId = String((profile as any).id);
          const u = await prisma.user.findUnique({ where: { discordId } });
          if (u) {
            (token as any).userId = u.id;
            (token as any).discordId = u.discordId;
          }
        } else if ((token as any).discordId) {
          const u = await prisma.user.findUnique({
            where: { discordId: (token as any).discordId as string },
          });
          if (u) {
            (token as any).userId = u.id;
          }
        }
      } catch (err) {
        console.error("NextAuth jwt callback error:", err);
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).user.id = (token as any).userId ?? null;
      (session as any).user.discordId = (token as any).discordId ?? null;
      return session;
    },
  },
});
