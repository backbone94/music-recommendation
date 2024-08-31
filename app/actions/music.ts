'use server';

import { SentimentScores } from '@/types/sentiment';
import { Artist, Track, TrackClient } from '@/types/spotify';
import axios from 'axios';

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

const getSpotifyAccessToken = async (clientId: string, clientSecret: string) => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  accessToken = response.data.access_token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
};

export const recommendMusic = async (sentimentScores: SentimentScores) => {
  if (!sentimentScores) {
    throw new Error('No sentimentScores provided');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('No client id or client secret provided');
  }

  try {
    if (!accessToken || (tokenExpiresAt && Date.now() >= tokenExpiresAt)) {
      await getSpotifyAccessToken(clientId, clientSecret);
    }

    const recommendationResponse = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: getRecommendationParams(sentimentScores),
      }
    );

    const track = recommendationResponse.data.tracks[0] as Track;
    const recommendedTrack: TrackClient = {
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: Artist) => artist.name).join(', '),
      albumImageUrl: track.album.images[0].url,
    }

    return recommendedTrack;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to recommend music');
  }
};

const getRecommendationParams = (sentimentScores: SentimentScores) => {
  let seedGenres = 'pop';
  let targetEnergy;
  let targetValence;

  if (sentimentScores.positive >= 50) {
    targetEnergy = sentimentScores.positive / 100;
    targetValence = sentimentScores.positive / 100;
  } else if (sentimentScores.negative >= 50) {
    targetEnergy = sentimentScores.negative / 100;
    targetValence = sentimentScores.negative / 100;
  } else {
    targetEnergy = sentimentScores.neutral / 100;
    targetValence = sentimentScores.neutral / 100;
  }

  return {
    seed_genres: seedGenres,
    target_energy: targetEnergy,
    target_valence: targetValence,
    limit: 1,
    min_popularity: 70,
  };
};
