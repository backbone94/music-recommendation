import prisma from '@/lib/prisma';
import DiaryDetailClientWrapper from '@/app/components/DiaryDetailClientWrapper';

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
