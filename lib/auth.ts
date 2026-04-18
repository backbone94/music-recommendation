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
    async signIn({ account }) {
      return !!account;
    },
    async jwt({ token, account, user }) {
      if (!account || !user) {
        return token;
      }
      // upsert로 signIn + jwt 두 번의 DB 쿼리를 하나로 통합
      const dbUser = await prisma.user.upsert({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        create: {
          email: user.email as string,
          name: user.name as string,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
        update: {},
      });

      token.userId = dbUser.id;
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
