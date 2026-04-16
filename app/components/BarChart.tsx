'use client';

import React from 'react';
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
import { SentimentScores } from '@/types/sentiment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ sentimentScores }: { sentimentScores: SentimentScores }) => {
  const { positive, negative, neutral } = sentimentScores;

  const data = {
    labels: ['🌈', '🌧️', '😐'],
    datasets: [
      {
        label: '감정 비율 (%)',
        data: [positive || 0, negative || 0, neutral || 0],
        backgroundColor: ['green', 'red', 'gray'],
        borderColor: ['green', 'red', 'gray'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          color: 'dimgray',
        },
      },
      title: {
        display: true,
        text: '감정 분석',
        font: {
          size: 18,
        },
        color: 'darkslategray',
      },
    },
    scales: {
      y: {
        max: 100,
        ticks: {
          font: {
            size: 12,
          },
          color: 'dimgray',
          callback: (value: number | string) => value === 0 || value === 50 || value === 100 ? value : null,
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 18,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-80 max-w-xl mx-auto mt-8 p-4 rounded-lg shadow-2xl">
      <Bar data={data} options={options} />
    </div>
  );
}

export default React.memo(BarChart);
