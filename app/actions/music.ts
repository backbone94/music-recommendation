'use server';

import { Sentiment } from '@/types/sentiment';
import { Artist, Track, TrackClient } from '@/types/spotify';
import axios from 'axios';

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
    const tokenResponse = await getSpotifyAccessToken(clientId, clientSecret);
    const recommendationResponse = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
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
  let seedGenres = 'k-pop';
  let targetEnergy = 0.5;
  let targetValence = 0.5;
  let targetTempo = 120;
  let targetDanceability = 0.5;
  let targetAcousticness = 0.5;
  let targetInstrumentalness = 0.5;
  let targetLiveness = 0.5;
  let targetLoudness = -14;

  if (sentiment.positive >= 50) {
    seedGenres = 'k-pop, pop, dance';
    targetEnergy = Math.min(1, sentiment.positive / 100 + 0.5);
    targetValence = Math.min(1, sentiment.positive / 100 + 0.5);
    targetTempo = 120 + Math.random() * 40;
    targetDanceability = Math.min(1, 0.5 + sentiment.positive / 100 + (Math.random() * 0.3 - 0.15));
    targetAcousticness = Math.random() * 0.2;
    targetInstrumentalness = Math.random() * 0.2;
    targetLiveness = 0.2 + Math.random() * 0.3;
    targetLoudness = -8 + Math.random() * 4;
  } else if (sentiment.negative >= 50) {
    seedGenres = 'k-pop, blues, classical, ambient';
    targetEnergy = Math.max(0, 0.5 - sentiment.negative / 100);
    targetValence = Math.max(0, 0.5 - sentiment.negative / 100);
    targetTempo = 60 + Math.random() * 40;
    targetDanceability = Math.max(0, 0.5 - sentiment.negative / 100 + (Math.random() * 0.3 - 0.15));
    targetAcousticness = 0.5 + Math.random() * 0.5;
    targetInstrumentalness = 0.5 + Math.random() * 0.5;
    targetLiveness = 0.1 + Math.random() * 0.2;
    targetLoudness = -20 + Math.random() * 6;
  } else {
    seedGenres = 'k-pop, indie, alternative, folk';
    targetEnergy = sentiment.neutral / 100;
    targetValence = sentiment.neutral / 100;
    targetTempo = 80 + Math.random() * 60;
    targetDanceability = Math.min(1, 0.4 + (Math.random() * 0.4 - 0.2));
    targetAcousticness = 0.2 + Math.random() * 0.4;
    targetInstrumentalness = 0.2 + Math.random() * 0.4;
    targetLiveness = 0.3 + Math.random() * 0.4;
    targetLoudness = -12 + Math.random() * 6;
  }

  targetEnergy = Math.min(Math.max(targetEnergy + (Math.random() * 0.4 - 0.2), 0), 1);
  targetValence = Math.min(Math.max(targetValence + (Math.random() * 0.4 - 0.2), 0), 1);

  return {
    seed_genres: seedGenres,
    target_energy: targetEnergy,
    target_valence: targetValence,
    target_tempo: targetTempo,
    target_danceability: targetDanceability,
    target_acousticness: targetAcousticness,
    target_instrumentalness: targetInstrumentalness,
    target_liveness: targetLiveness,
    target_loudness: targetLoudness,
    limit: 1,
  };
};
