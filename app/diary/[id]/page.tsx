import { PrismaClient } from '@prisma/client';
import DiaryDetailClient from '@/app/components/DiaryDetailClient';

const prisma = new PrismaClient();

export default async function DiaryDetailPage({ params }: { params: { id: string } }) {
  const diary = await prisma.diary.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  });

  if (!diary) {
    return <div>Diary not found</div>;
  }

  return <DiaryDetailClient diary={diary} />;
}
