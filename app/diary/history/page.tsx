import React from 'react';
import LineChart from '@/app/components/LineChart';
import { getDiaries } from '@/app/actions/diary';
import { getWeeklyAnalysis } from '@/app/actions/advice';

const HistoryPage = async () => {
  const diaries = await getDiaries(7);
  const combinedContent = diaries.map(diary => diary.content).join('\n');
  const analysis = await getWeeklyAnalysis(combinedContent);

  return (
    <div>
      <h1>Diary History</h1>
      <LineChart diaries={diaries} />
      <div>{analysis}</div>
    </div>
  );
};

export default HistoryPage;
