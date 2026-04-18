import { unstable_cache } from 'next/cache';
import { recommendMusic } from '@/app/actions/music';
import { searchYouTube } from '@/app/actions/youtube';

const extractVideoId = (url: string) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
  return match ? match[1] : null;
};

export const getMusicRecommendation = unstable_cache(
  async (diaryId: number, diaryContent: string) => {
    const track = await recommendMusic(diaryContent);
    const videoUrl = await searchYouTube(track.title, track.artist);
    return { track, videoId: extractVideoId(videoUrl) };
  },
  ['music-recommendation'],
  { tags: ['music'], revalidate: 60 * 60 * 24 }
);
