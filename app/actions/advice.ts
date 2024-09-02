'use server'

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import axios from 'axios';
import prisma from '@/lib/prisma';

export const getAdvice = async (content: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Based on the following diary entries from the past week, please provide one comprehensive piece of advice for the user. Make sure the advice is warm, comforting, and uses a friendly tone. End every sentence with an emoji to make it more engaging and cheerful. Respond in one sentence, in Korean, and use polite language. Each sentence should end with an emoji. Diary entry: "${content}".`,
        },
      ],
      temperature: 1,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPEN_AI_SECRET}`,
      },
    }
  );

  const advice = response.data.choices[0].message.content.trim() as string;
  const cleanedAdvice = advice.replace(/^"|"$/g, '');

  return cleanedAdvice;
}

export const getWeeklyAnalysis = async (contents: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userId = session.user.id;

  const existingAdvice = await prisma.weeklyAdvice.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  if (existingAdvice) {
    return existingAdvice.advice;
  }

  const newAdvice = await generateWeeklyAnalysis(contents);

  await prisma.weeklyAdvice.create({
    data: {
      userId,
      advice: newAdvice,
    },
  });

  return newAdvice;
}

export const generateWeeklyAnalysis = async (contents: string) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Based on the following diary entries from the past week, please provide a detailed, warm, and comforting analysis for the user.Address different emotions and experiences mentioned in the entries separately, offering empathetic advice for each.Ensure the tone is friendly and supportive, without directly referencing specific days.Each sentence should end with an emoji to make it more engaging and cheerful.Respond in Korean and use polite language.Diary entries: "${contents}".`,
          }
        ],
        temperature: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPEN_AI_SECRET}`,
        }
      }
    );

    const analysis = response.data.choices[0].message.content.trim() as string;

    return analysis;
  } catch (error) {
    console.error('Error generating warm analysis:', error);
    throw new Error('Failed to generate warm analysis');
  }
}
