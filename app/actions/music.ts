'use server';

import axios from 'axios';

export type Track = {
  title: string,
  artist: string,
}

const OPENAI_MODEL_MUSIC = process.env.OPENAI_MODEL_MUSIC || 'gpt-3.5-turbo';

export const recommendMusic = async (diaryContent: string) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL_MUSIC,
        messages: [
          {
            role: 'user',
            content: `Based on the following diary content, suggest a popular song title and artist from the United States that was released after 2010. The diary content is: "${diaryContent}". Provide the response in the format: {"title": "song title", "artist": "artist name"}.`,
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

    const songRecommendation: Track = JSON.parse(response.data.choices[0].message.content);

    return songRecommendation;
  } catch (error) {
    console.error('Error fetching music recommendation:', error);
    throw new Error('Failed to fetch music recommendation');
  }
};
