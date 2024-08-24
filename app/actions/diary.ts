'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function writeDiary(title: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  try {
    await prisma.diary.create({
      data: {
        title,
        content,
        userId: Number(session.user.id),
      },
    });

    revalidatePath('/diary');
  } catch (error) {
    console.error('Error creating diary entry:', error);
    throw new Error('Failed to create diary entry');
  }
}

export async function updateDiary(diaryId: number, title: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const diary = await prisma.diary.findUnique({
    where: {
      id: diaryId,
    },
  });

  if (!diary || diary.userId !== session.user.id) {
    throw new Error('Diary not found or you do not have permission to edit this diary.');
  }

  await prisma.diary.update({
    where: {
      id: diaryId,
    },
    data: {
      title,
      content,
    },
  });

  revalidatePath(`/diary/${diaryId}`);
}

export async function deleteDiary(diaryId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const diary = await prisma.diary.findUnique({
    where: {
      id: diaryId,
    },
  });

  if (!diary || diary.userId !== session.user.id) {
    throw new Error('Diary not found or you do not have permission to delete this diary.');
  }

  await prisma.diary.delete({
    where: {
      id: diaryId,
    },
  });

  revalidatePath('/diary');
}
