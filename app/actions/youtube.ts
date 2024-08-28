'use server';

import axios from "axios";

export const searchYouTube = async (trackName: string, artists: string): Promise<string> => {
  try {
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${trackName} ${artists}`,
        type: 'video',
        key: process.env.GOOGLE_CLIENT_SECRET,
        maxResults: 1,
        order: 'relevance',
      },
    });

    return `https://www.youtube.com/watch?v=${searchResponse.data.items[0].id.videoId}`;
  } catch (error) {
    console.error('Failed to search YouTube:', error);
    throw new Error('Failed to search YouTube');
  }
};
