import { getDiaries } from '@/lib/data/diary';
import { getCachedWeeklyAnalysis } from '@/lib/data/advice';
import HistoryClient from '@/app/components/HistoryClient';

export default async function HistoryPage() {
  const [diaries, cachedAnalysis] = await Promise.all([
    getDiaries(7),
    getCachedWeeklyAnalysis(),
  ]);
  return <HistoryClient initialDiaries={diaries} initialAnalysis={cachedAnalysis ?? ''} />;
}
