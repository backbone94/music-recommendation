'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { analyzeSentiment } from './sentiment';

export async function writeDiary(title: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  try {
    const sentimentData = await analyzeSentiment(content);
    const { positive, negative, neutral } = sentimentData.document.confidence;

    await prisma.diary.create({
      data: {
        title,
        content,
        userId: Number(session.user.id),
        mainSentiment: sentimentData.document.sentiment,
        positive,
        negative,
        neutral,
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

  const sentimentData = await analyzeSentiment(content);
  const { positive, negative, neutral } = sentimentData.document.confidence;

  await prisma.diary.update({
    where: {
      id: diaryId,
    },
    data: {
      title,
      content,
      userId: Number(session.user.id),
      mainSentiment: sentimentData.document.sentiment,
      positive,
      negative,
      neutral,
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
