'use client'

import { formatDate } from '@/lib/date';
import { Diary } from '@prisma/client';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ diaries }: { diaries: Diary[] }) => {
  if (!diaries) {
    return <div className="text-center text-gray-500">No diaries available</div>;
  }

  const getEmojiForScore = (score: number) => {
    switch (score) {
      case 100:
        return '🎉';
      case 0:
        return '0';
      case -100:
        return '🌧️';
      default:
        return '';
    }
  };

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
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        ticks: {
          stepSize: 100,
          callback: (value: number | string) => getEmojiForScore(Number(value)),
        },
      },
    },
  };

  return (
    <div className="max-w-full h-100 mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">감정 히스토리</h1>
      <div className="h-full w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
