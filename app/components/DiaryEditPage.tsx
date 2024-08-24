'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';

export default function DiaryEditPage({ diary }: { diary: Diary }) {
  const router = useRouter();
  const [title, setTitle] = useState(diary.title);
  const [content, setContent] = useState(diary.content);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateDiary(diary.id, title, content);
      router.push(`/diary/${diary.id}`);
    } catch (error) {
      console.error('Failed to update the diary:', error);
    }
  };

  return (
    <div>
      <h1>Edit Diary Entry</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
