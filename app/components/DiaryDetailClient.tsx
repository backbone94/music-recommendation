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
import { TrackClient } from '@/types/spotify';
import { Sentiment } from '@/types/sentiment';
import { analyzeSentiment } from '../actions/sentiment';
import { recommendMusic } from '../actions/music';
import { searchYouTube } from '../actions/youtube';
import Image from 'next/image';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DiaryDetailClient = ({ diary }: { diary: Diary }) => {
  const router = useRouter();

  const { data: sentiment, error: sentimentError, isLoading: sentimentLoading } = useQuery(
    ['sentiment', diary.content],
    () => analyzeSentiment(diary.content),
    {
      enabled: !!diary.content,
      select: (result) => result.document.confidence as Sentiment,
    }
  );

  const { data: track } = useQuery(
    ['track', sentiment],
    () => {
      if (!sentiment) {
        throw new Error('Sentiment data is undefined');
      }
      return recommendMusic(sentiment);
    },
    {
      enabled: false,
      initialData: { // Mock 데이터 사용
        id: 123123123,
        albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b27388bfb4afe3a9acee2b578f63',
        artists: 'epic high',
        name: 'fly',
      } as TrackClient,
    }
  );

  const { data: videoId } = useQuery(
    ['youtube', track],
    () => {
      if (!track) {
        throw new Error('track data is undefined');
      }
      return searchYouTube(track.name, track.artists);
    },
    {
      enabled: false,
      initialData: 'sHqLlyBlmQI', // Mock 데이터 사용
    }
  );

  const data = {
    labels: ['긍정', '부정', '중립'],
    datasets: [
      {
        label: '감정 비율 (%)',
        data: [sentiment?.positive || 0, sentiment?.negative || 0, sentiment?.neutral || 0],
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

  const extractVideoId = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
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

  if (sentimentLoading) {
    return <div>Loading...</div>;
  }

  if (sentimentError) {
    return <div>Error occurred while fetching data.</div>;
  }

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
        {track && (
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
        )}

        {videoId && (
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
        )}
      </div>
    </div>
  );
}

export default DiaryDetailClient;
