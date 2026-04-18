import { notFound } from 'next/navigation';
import { getDiary } from '@/lib/data/diary';
import DiaryEditPage from '@/app/components/DiaryEditPage';

export const revalidate = 3600;

export default async function DiaryEditPageWrapper({ params }: { params: { id: string } }) {
  const diary = await getDiary(parseInt(params.id, 10));

  if (!diary) {
    notFound();
  }

  return <DiaryEditPage diary={diary} />;
}
