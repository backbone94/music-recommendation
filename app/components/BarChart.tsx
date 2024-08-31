'use client';

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
    labels: ['긍정', '부정', '중립'],
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

  return (
    <div style={{ width: '500px', height: '300px', marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
