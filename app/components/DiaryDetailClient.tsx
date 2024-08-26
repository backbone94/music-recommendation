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
import { analyzeSentiment } from '@/app/actions/diary';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DiaryDetailClient = ({ diary }: { diary: Diary }) => {
  const router = useRouter();
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  const data = {
    labels: ['긍정', '부정', '중립'],
    datasets: [
      {
        label: '감정 비율 (%)',
        data: Object.values(sentimentData),
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
  };

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const result = await analyzeSentiment(diary.content);

        setSentimentData({
          positive: result.document.confidence.positive,
          negative: result.document.confidence.negative,
          neutral: result.document.confidence.neutral,
        });
      } catch (error) {
        console.error('Failed to analyze sentiment:', error);
      }
    };

    fetchSentimentData();
  }, [diary.content]);

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

      <div style={{ width: '500px', height: '300px', marginTop: '20px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default DiaryDetailClient;
