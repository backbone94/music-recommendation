import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import DiaryDetailClientWrapper from '@/app/components/DiaryDetailClientWrapper';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const diary = await prisma.diary.findUnique({
    where: { id: parseInt(params.id, 10) },
    select: { title: true },
  });
  return {
    title: diary?.title ?? '일기',
  };
}

export default async function DiaryDetailPage({ params }: { params: { id: string } }) {
  const diary = await prisma.diary.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  });

  if (!diary) {
    return <div>Diary not found</div>;
  }

  return <DiaryDetailClientWrapper diary={diary} />;
}
