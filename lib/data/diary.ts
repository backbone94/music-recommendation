import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Diary } from '@prisma/client';

export async function getDiaries(days?: number): Promise<Diary[]> {
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
  });
}
