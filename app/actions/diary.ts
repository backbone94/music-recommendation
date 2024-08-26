'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import axios from 'axios';
import { SpotifyTrack } from '@/types/spotify';

const getSpotifyAccessToken = async (clientId: string, clientSecret: string) => {
  return await axios.post('https://accounts.spotify.com/api/token', 
    'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
}

export const recommendMusic = async (keywords: string[]) => {
  if (!keywords || keywords.length === 0) {
    throw new Error('No keywords provided');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('No client id or client secret provided');
  }
  
  try {
    const tokenResponse = await getSpotifyAccessToken(clientId, clientSecret);
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(keywords.join(' '))}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      },
    );

    const tracks = searchResponse.data.tracks.items;

    return tracks.map((track: SpotifyTrack) => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      url: track.external_urls.spotify,
    }));
    
  } catch (error) {
    throw new Error('Failed to recommend music');
  }
}

export const extractKeyword = async (content: string) => {
  if (!content) {
    throw new Error('No text provided');
  }

  try {
    const response = await axios.post(
      `https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.GOOGLE_CLIENT_SECRET}`,
      {
        document: {
          type: 'PLAIN_TEXT' as const,
          content,
        },
        encodingType: 'UTF8',
      },
    );

    const entities = response.data.entities.map((entity: { name: string }) => (entity.name));

    return entities.slice(0, 5);
  } catch (error) {
    console.error('Failed to analyze text', error);
    throw new Error('Failed to analyze text');
  }
}

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
