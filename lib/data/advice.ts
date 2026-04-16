import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getCachedWeeklyAnalysis(): Promise<string | undefined> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Not authenticated');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAdvice = await prisma.weeklyAdvice.findFirst({
    where: {
      userId: session.user.id,
      createdAt: { gte: today },
    },
  });

  return existingAdvice?.advice;
}
