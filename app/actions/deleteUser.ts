'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function deleteUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        provider: session.user.provider as string,
        providerAccountId: session.user.providerAccountId as string,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user');
  }
}
