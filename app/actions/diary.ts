'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { analyzeSentiment } from './sentiment';
import { getAdvice } from './advice';
import { Diary } from '@prisma/client';

export async function writeDiary(title: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  try {
    const sentimentData = await analyzeSentiment(content);
    const { positive, negative, neutral } = sentimentData.document.confidence;

    const advice = await getAdvice(content);

    await prisma.diary.create({
      data: {
        title,
        content,
        userId: Number(session.user.id),
        mainSentiment: sentimentData.document.sentiment,
        positive,
        negative,
        neutral,
        advice,
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

export async function getDiaries(days?: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const fromDate = days ? new Date() : undefined;
  if (fromDate && days) {
    fromDate.setDate(fromDate.getDate() - days);
  }

  try {
    const diaries: Diary[] = await prisma.diary.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: fromDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return diaries;
  } catch (error) {
    console.error('Error fetching diaries:', error);
    throw new Error('Failed to fetch diaries');
  }
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
