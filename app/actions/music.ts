'use server';

// import { SentimentScores } from '@/types/sentiment';
// import { Artist, Track, TrackClient } from '@/types/spotify';
import axios from 'axios';

export type Track = {
  title: string,
  artist: string,
}

export const recommendMusic = async (diaryContent: string) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Based on the following diary content, suggest a popular and recent song title and artist from either South Korea or the United States. The diary content is: "${diaryContent}". Provide the response in the format: {"title": "song title", "artist": "artist name"}. Make sure the song is popular and was released recently.`,
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

// let accessToken: string | null = null;
// let tokenExpiresAt: number | null = null;

// const getSpotifyAccessToken = async (clientId: string, clientSecret: string) => {
//   const response = await axios.post(
//     'https://accounts.spotify.com/api/token',
//     'grant_type=client_credentials',
//     {
//       headers: {
//         Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     }
//   );
//   accessToken = response.data.access_token;
//   tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
// };

// export const recommendMusic = async (sentimentScores: SentimentScores) => {
//   if (!sentimentScores) {
//     throw new Error('No sentimentScores provided');
//   }

//   const clientId = process.env.SPOTIFY_CLIENT_ID;
//   const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

//   if (!clientId || !clientSecret) {
//     throw new Error('No client id or client secret provided');
//   }

//   try {
//     if (!accessToken || (tokenExpiresAt && Date.now() >= tokenExpiresAt)) {
//       await getSpotifyAccessToken(clientId, clientSecret);
//     }

//     const recommendationResponse = await axios.get(
//       'https://api.spotify.com/v1/recommendations',
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         params: getRecommendationParams(sentimentScores),
//       }
//     );

//     const track = recommendationResponse.data.tracks[0] as Track;
//     const recommendedTrack: TrackClient = {
//       id: track.id,
//       name: track.name,
//       artists: track.artists.map((artist: Artist) => artist.name).join(', '),
//       albumImageUrl: track.album.images[0].url,
//     }

//     return recommendedTrack;
//   } catch (error) {
//     console.log(error)
//     throw new Error('Failed to recommend music');
//   }
// };

// const getRecommendationParams = (sentimentScores: SentimentScores) => {
//   const { positive, negative, neutral } = sentimentScores;
//   let seedGenres = 'pop';
//   let targetEnergy;
//   let targetValence;

//   if (positive >= 50) {
//     targetEnergy = positive / 100;
//     targetValence = positive / 100;
//   } else if (negative >= 50) {
//     targetEnergy = negative / 100;
//     targetValence = negative / 100;
//   } else {
//     targetEnergy = neutral / 100;
//     targetValence = neutral / 100;
//   }

//   return {
//     seed_genres: seedGenres,
//     target_energy: targetEnergy,
//     target_valence: targetValence,
//     limit: 1,
//     min_popularity: 70,
//   };
// };
