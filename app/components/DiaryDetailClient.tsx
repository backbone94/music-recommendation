'use client';

import { useRouter } from 'next/navigation';
import { deleteDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';
import { useQuery } from 'react-query';
import { searchYouTube } from '../actions/youtube';
import BarChart from './BarChart';
import { recommendMusic } from '../actions/music';

const DiaryDetailClient = ({ diary }: { diary: Diary }) => {
  const router = useRouter();
  const { positive, negative,neutral } = diary;

  const extractVideoId = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const { data: track, error: trackError, isLoading: trackLoading } = useQuery(
    ['track', diary.id],
    () => recommendMusic(diary.content),
    {
      enabled: !!diary,
      staleTime: 1000 * 60 * 60,
    }
  );

  const { data: videoId, error: videoError, isLoading: videoLoading } = useQuery(
    ['youtube', track],
    () => searchYouTube(track!.title, track!.artist),
    {
      enabled: !!track,
      select: (videoUrl) => extractVideoId(videoUrl),
    }
  );

  const handleDelete = async () => {
    try {
      await deleteDiary(diary.id);
      router.push('/diary');
    } catch (error) {
      console.error('Failed to delete the diary:', error);
    }
  };

  const handleUpdate = () => {
    router.push(`/diary/${diary.id}/edit`);
  };

  if (trackError) {
    return <div>Failed to load track.</div>;
  }

  if (trackLoading) {
    return <div>track is loading...</div>;
  }

  return (
    <div>
      <h1>{diary.title}</h1>
      <p>{diary.content}</p>
      <p><em>{new Date(diary.createdAt).toLocaleDateString()}</em></p>
      <button onClick={handleUpdate}>Update Diary</button>
      <button onClick={handleDelete}>Delete Diary</button>

      <BarChart sentimentScores={{positive, negative, neutral}} />

      <h4>{diary.advice}</h4><br/>

      {videoLoading ? (
        <div>Loading video...</div>
      ) : videoError ? (
        <div>Error occurred while fetching video data.</div>
      ) : (
        videoId && (
          <div style={{ flex: 1 }}>
            <h2>Related YouTube Video</h2>
            <iframe
              width="50%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )
      )}
    </div>
  );
}

export default DiaryDetailClient;
