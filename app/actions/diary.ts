'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateTag } from 'next/cache';
import { analyzeSentiment } from './sentiment';
import { getAdvice } from './advice';
import { DIARY_PAGE_SIZE } from '@/lib/data/diary';

export async function writeDiary(title: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  try {
    const [sentimentData, advice] = await Promise.all([
      analyzeSentiment(content),
      getAdvice(content),
    ]);
    const { positive, negative, neutral } = sentimentData.document.confidence;

    await prisma.diary.create({
      data: {
        title,
        content,
        userId: session.user.id,
        mainSentiment: sentimentData.document.sentiment,
        positive,
        negative,
        neutral,
        advice,
      },
    });

    revalidateTag('diary');
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
    where: { id: diaryId },
  });

  if (!diary || diary.userId !== session.user.id) {
    throw new Error('Diary not found or you do not have permission to edit this diary.');
  }

  // 내용이 변경된 경우에만 감정 분석 재실행
  const contentChanged = diary.content !== content;
  let sentimentFields = {};

  if (contentChanged) {
    const sentimentData = await analyzeSentiment(content);
    const { positive, negative, neutral } = sentimentData.document.confidence;
    sentimentFields = {
      mainSentiment: sentimentData.document.sentiment,
      positive,
      negative,
      neutral,
    };
  }

  await prisma.diary.update({
    where: { id: diaryId },
    data: {
      title,
      content,
      ...sentimentFields,
    },
  });

  revalidateTag('diary');
}

export async function deleteDiary(diaryId: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const diary = await prisma.diary.findUnique({
    where: { id: diaryId },
  });

  if (!diary || diary.userId !== session.user.id) {
    throw new Error('Diary not found or you do not have permission to delete this diary.');
  }

  await prisma.diary.delete({
    where: { id: diaryId },
  });

  revalidateTag('diary');
}

export async function fetchMoreDiaries(skip: number) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  return prisma.diary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    skip,
    take: DIARY_PAGE_SIZE,
  });
}
