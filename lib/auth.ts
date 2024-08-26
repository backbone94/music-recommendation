import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import KakaoProvider from "next-auth/providers/kakao";
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) {
        console.error("Account information is missing.");
        return false;
      }
      try {
        const existingUser = await prisma.user.findFirst({
          where: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });
        }
      } catch (error) {
        console.error('Error saving user to DB:', error);
        return false;
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (!account || !user) {
        return token;
      }
      const existingUser = await prisma.user.findFirst({
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      });

      token.userId = existingUser ? existingUser.id : Number(user.id);
      token.provider = account.provider;
      token.providerAccountId = account.providerAccountId;
      return token;
    },
    async session({ session, token }) {
      if (!session || !session.user) {
        return session;
      }
      session.user.id = token.userId;
      session.user.provider = token.provider;
      session.user.providerAccountId = token.providerAccountId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
