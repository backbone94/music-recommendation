'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function DiaryEditPage({ diary }: { diary: Diary }) {
  const router = useRouter();
  const [title, setTitle] = useState(diary.title);
  const [content, setContent] = useState(diary.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await updateDiary(diary.id, title, content);
      router.push(`/diary/${diary.id}`);
    } catch (error) {
      console.error('Failed to update the diary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md select-none">
      <button
        onClick={() => router.push(`/diary/${diary.id}`)}
        className="text-xl mb-4 hover:bg-gray-300 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ←
      </button>
      <h1 className="text-2xl font-bold mb-4">수정하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            rows={10}
          ></textarea>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded transition duration-200 ${isLoading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          저장하기
        </button>
      </form>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
