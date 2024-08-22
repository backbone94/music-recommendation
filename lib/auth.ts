import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    async jwt({ token, account }) {
      if (!account) {
        return token;
      }
      token.provider = account.provider;
      token.providerAccountId = account.providerAccountId;
      return token;
    },
    async session({ session, token }) {
      if (!session || !session.user) {
        return session;
      }
      session.user.provider = token.provider as string;
      session.user.providerAccountId = token.providerAccountId as string;
      return session;
    },
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};
