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
import { Sentiment } from '@/types/sentiment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ sentiment }: { sentiment: Sentiment }) => {
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

  return (
    <div style={{ width: '500px', height: '300px', marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
