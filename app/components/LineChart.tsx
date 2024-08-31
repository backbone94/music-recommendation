'use client'

import { getDiariesByUserId } from '@/app/actions/diary';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useQuery } from 'react-query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const today = new Date();
  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();

  const isSameYear = today.getFullYear() === year;

  if (isToday) {
    return `${hours}:${minutes}`;
  } else if (isSameYear) {
    return `${month}/${day} ${hours}:${minutes}`;
  } else {
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
};

const LineChart = () => {
  const { data: diaries, error: diariesError, isLoading: diariesLoading } = useQuery(
    'diaries',
    () => getDiariesByUserId(),
  );

  if (diariesLoading) {
    return <div>Loading...</div>;
  }

  if (diariesError) {
    return <div>Error loading diaries.</div>;
  }

  if (!diaries) {
    return <div>No diaries available</div>;
  }

  const data = {
    labels: diaries.map((diary) => formatDate(diary.createdAt)),
    datasets: [
      {
        label: '감정 점수',
        data: diaries.map((diary) => {
          const { positive, negative } = diary;
          return positive - negative;
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
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
        text: '감정 히스토리',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
