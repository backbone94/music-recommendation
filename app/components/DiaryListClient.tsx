'use client';

import { Diary } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DiaryListClient({ diaries }: { diaries: Diary[] }) {
  const router = useRouter();

  return (
    <div>
      <h1>Diary Entries</h1>
      <div>
        <button onClick={() => router.push('/diary/new')}>
          Write New Diary
        </button>
      </div>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <h2>
              <Link href={`/diary/${diary.id}`}>
                {diary.title}
              </Link>
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
