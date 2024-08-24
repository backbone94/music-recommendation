import { PrismaClient } from '@prisma/client';
import DiaryEditPage from '@/app/components/DiaryEditPage';

const prisma = new PrismaClient();

export default async function DiaryEditPageWrapper({ params }: { params: { id: string } }) {
  const diary = await prisma.diary.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  });

  if (!diary) {
    return <div>Diary not found</div>;
  }

  return <DiaryEditPage diary={diary} />;
}
