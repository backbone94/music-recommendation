'use client';

import { useRouter } from 'next/navigation';
import { deleteDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';

export default function DiaryDetailClient({ diary }: { diary: Diary }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteDiary(diary.id);
      router.push('/diary');
    } catch (error) {
      console.error('Failed to delete the diary:', error);
    }
  };

  const handleUpdate = () => {
    router.push(`/diary/${diary.id}/edit`);
  };

  return (
    <div>
      <h1>{diary.title}</h1>
      <p>{diary.content}</p>
      <p><em>{new Date(diary.createdAt).toLocaleDateString()}</em></p>
      <button onClick={handleUpdate}>Update Diary</button>
      <button onClick={handleDelete}>Delete Diary</button>
    </div>
  );
}
