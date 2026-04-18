'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function deleteUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const userId = session.user.id;

  try {
    // 트랜잭션으로 다이어리 먼저 삭제 후 유저 삭제 (외래키 제약 방지)
    await prisma.$transaction([
      prisma.diary.deleteMany({ where: { userId } }),
      prisma.weeklyAdvice.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
}
