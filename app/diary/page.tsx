import { getDiaries } from '@/lib/data/diary';
import DiaryListClient from '@/app/components/DiaryListClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DiaryPage() {
  const session = await getServerSession(authOptions);
  const [diaries, totalCount] = await Promise.all([
    getDiaries(),
    prisma.diary.count({ where: { userId: session!.user.id } }),
  ]);
  return <DiaryListClient initialDiaries={diaries} totalCount={totalCount} />;
}
