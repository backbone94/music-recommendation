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
import { useEffect, useState } from 'react';
import { TrackClient } from '@/types/spotify';
import { Sentiment } from '@/types/sentiment';
import { analyzeSentiment } from '../actions/sentiment';
import { recommendMusic } from '../actions/music';
import { searchYouTube } from '../actions/youtube';
import Image from 'next/image';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DiaryDetailClient = ({ diary }: { diary: Diary }) => {
  const router = useRouter();
  const [sentiment, setSentiment] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [track, setTrack] = useState<TrackClient | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  const data = {
    labels: ['긍정', '부정', '중립'],
    datasets: [
      {
        label: '감정 비율 (%)',
        data: [sentiment.positive, sentiment.negative, sentiment.neutral],
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

  const videoId = videoUrl ? extractVideoId(videoUrl) : null;

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const result = await analyzeSentiment(diary.content);
        const sentiment = result.document.confidence as Sentiment;
        setSentiment(sentiment);
      } catch (error) {
        console.error('Failed to analyze sentiment:', error);
      }
    };

    fetchSentiment();
  }, [diary.content]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const isSentimentInitialized =
        sentiment.positive !== 0 ||
        sentiment.negative !== 0 ||
        sentiment.neutral !== 0;

      if (!isSentimentInitialized) {
        return;
      }

      try {
        // const recommendedTrack = await recommendMusic(sentiment);
        // mock 데이터
        const recommendedTrack: TrackClient = {
          id: 123123123,
          albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b27388bfb4afe3a9acee2b578f63',
          artists: 'epic high',
          name: 'fly',
        };
        setTrack(recommendedTrack);
      } catch (error) {
        console.error('Failed to recommend music:', error);
      }
    };

    fetchRecommendations();
  }, [sentiment]);

  useEffect(() => {
    if (track === null) {
      return;
    }
    const fetchYoutubeVideo = async () => {
      try {
         const videoUrl = await searchYouTube(track.name, track.artists);
         setVideoUrl(videoUrl);
      } catch (error) {
        console.error('Failed to fetch video:', error);
      }
    }

    fetchYoutubeVideo();
  }, [track])

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

      <h2>Recommended Tracks</h2>
      {track && (<Image src={track.albumImageUrl} width="320" height="320" alt="album" />)}
      <ul>
      {track && (
        <a href={track.url} target="_blank" rel="noopener noreferrer">
          {track.name} by {track.artists}
        </a>
      )}
      </ul>

      {videoId && (
        <div>
          <h2>Related YouTube Video</h2>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default DiaryDetailClient;
