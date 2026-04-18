import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const revalidate = 3600;

import { getDiary } from '@/lib/data/diary';
import DiaryDetailClient from '@/app/components/DiaryDetailClient';
import MusicSection from '@/app/components/MusicSection';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const diary = await getDiary(parseInt(params.id, 10));
  return {
    title: diary?.title ?? '일기',
  };
}

export default async function DiaryDetailPage({ params }: { params: { id: string } }) {
  const diary = await getDiary(parseInt(params.id, 10));

  if (!diary) {
    notFound();
  }

  const musicSection = (
    <Suspense fallback={<LoadingSpinner />}>
      <MusicSection diaryId={diary.id} diaryContent={diary.content} />
    </Suspense>
  );

  return <DiaryDetailClient diary={diary} musicSection={musicSection} />;
}
