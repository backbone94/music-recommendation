import { getDiaries } from '@/lib/data/diary';
import DiaryListClient from '@/app/components/DiaryListClient';

export default async function DiaryPage() {
  const diaries = await getDiaries();
  return <DiaryListClient initialDiaries={diaries} />;
}
