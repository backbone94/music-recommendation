import type { Metadata } from 'next';

export const revalidate = 3600;
import { getDiary } from '@/lib/data/diary';
import DiaryDetailClientWrapper from '@/app/components/DiaryDetailClientWrapper';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const diary = await getDiary(parseInt(params.id, 10));
  return {
    title: diary?.title ?? '일기',
  };
}

export default async function DiaryDetailPage({ params }: { params: { id: string } }) {
  const diary = await getDiary(parseInt(params.id, 10));

  if (!diary) {
    return <div>Diary not found</div>;
  }

  return <DiaryDetailClientWrapper diary={diary} />;
}
