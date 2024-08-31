'use client';

import { useRouter } from 'next/navigation';
import { deleteDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useQuery } from 'react-query';
import { Sentiment } from '@/types/sentiment';
import { recommendMusic } from '../actions/music';
import { searchYouTube } from '../actions/youtube';
import Image from 'next/image';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DiaryDetailClient = ({ diary }: { diary: Diary }) => {
  const router = useRouter();
  const sentiment: Sentiment = JSON.parse(diary.sentiment!.toString());

  const extractVideoId = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const { data: track, error: trackError, isLoading: trackLoading } = useQuery(
    'track',
    () => recommendMusic(sentiment),
    {
      enabled: !!sentiment,
    }
  );

  const { data: videoId, error: videoError, isLoading: videoLoading } = useQuery(
    'youtube',
    () => searchYouTube(track!.name, track!.artists),
    {
      enabled: !!track,
      select: (videoUrl) => extractVideoId(videoUrl),
    }
  );

  const data = {
    labels: ['긍정', '부정', '중립'],
    datasets: [
      {
        label: '감정 비율 (%)',
        data: [sentiment.positive || 0, sentiment.negative || 0, sentiment.neutral || 0],
        backgroundColor: ['green', 'red', 'gray'],
        borderColor: ['green', 'red', 'gray'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '감정 분석 결과',
      },
    },
    scales: {
      y: {
        max: 100,
      },
    },
  };

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

  return (
    <div>
      <h1>{diary.title}</h1>
      <p>{diary.content}</p>
      <p><em>{new Date(diary.createdAt).toLocaleDateString()}</em></p>
      <button onClick={handleUpdate}>Update Diary</button>
      <button onClick={handleDelete}>Delete Diary</button>

      {sentiment && (
        <div style={{ width: '500px', height: '300px', marginTop: '20px' }}>
          <Bar data={data} options={options} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {trackLoading ? (
            <div>Loading track...</div>
          ) : trackError ? (
            <div>Error occurred while fetching track data.</div>
          ) : (
            track && (
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Recommended Tracks</h2>
                <Image src={track.albumImageUrl} width="320" height="320" alt="album" />
                <ul>
                  <li>
                    <a href={track.url} target="_blank" rel="noopener noreferrer">
                      {track.name} by {track.artists}
                    </a>
                  </li>
                </ul>
              </div>
            )
          )}

        {videoLoading ? (
          <div>Loading video...</div>
        ) : videoError ? (
          <div>Error occurred while fetching video data.</div>
        ) : (
          videoId && (
            <div style={{ flex: 1 }}>
              <h2>Related YouTube Video</h2>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default DiaryDetailClient;
