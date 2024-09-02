'use server'

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import axios from 'axios';

export const getAdvice = async (content: string) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
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
