'use server';

import axios from 'axios';

export const analyzeSentiment = async (content: string) => {
  try {
    const response = await axios.post(
      'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze',
      { content },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLIENT_ID || '',
          'X-NCP-APIGW-API-KEY': process.env.NAVER_CLIENT_SECRET || '',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error('Failed to analyze sentiment');
  }
}
