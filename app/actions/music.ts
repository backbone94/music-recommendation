'use server';

import { Sentiment } from '@/types/sentiment';
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

export const recommendMusic = async (sentiment: Sentiment) => {
  if (!sentiment) {
    throw new Error('No sentiment provided');
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
        params: getRecommendationParams(sentiment),
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

const getRecommendationParams = (sentiment: Sentiment) => {
  let seedGenres = 'pop, rock, dance, electronic, indie, hip-hop';
  let targetEnergy;
  let targetValence;

  if (sentiment.positive >= 50) {
    targetEnergy = Math.min(1, sentiment.positive / 100 + 0.5);
    targetValence = Math.min(1, sentiment.positive / 100 + 0.5);
  } else if (sentiment.negative >= 50) {
    seedGenres = 'blues, classical, ambient, jazz';
    targetEnergy = Math.max(0, 0.5 - sentiment.negative / 100);
    targetValence = Math.max(0, 0.5 - sentiment.negative / 100);
  } else {
    seedGenres = 'indie, alternative, folk, chill';
    targetEnergy = sentiment.neutral / 100;
    targetValence = sentiment.neutral / 100;
  }

  return {
    seed_genres: seedGenres,
    target_energy: targetEnergy,
    target_valence: targetValence,
    limit: 1,
    min_popularity: 70,
  };
};
