import { PrismaClient } from '@prisma/client';
import DiaryListClient from '../components/DiaryListClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function DiaryList() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Please log in</div>;
  }

  const diaries = await prisma.diary.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <DiaryListClient diaries={diaries} />;
}
