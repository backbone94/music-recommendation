import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Diary } from '@prisma/client';

export const DIARY_PAGE_SIZE = 10;

export const getDiary = unstable_cache(
  async (id: number): Promise<Diary | null> => {
    return prisma.diary.findUnique({ where: { id } });
  },
  ['diary-detail'],
  { tags: ['diary'], revalidate: 3600 }
);

export async function getDiaries(days?: number, skip = 0, take = DIARY_PAGE_SIZE): Promise<Diary[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Not authenticated');

  const fromDate = days ? new Date() : undefined;
  if (fromDate && days) {
    fromDate.setDate(fromDate.getDate() - days);
  }

  return prisma.diary.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: fromDate },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
}
