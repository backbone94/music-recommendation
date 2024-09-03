'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { writeDiary } from '@/app/actions/diary';

const NewDiaryEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await writeDiary(title, content);
      router.push('/diary');
    } catch (error) {
      console.error('Failed to save the diary entry:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
      <button
        onClick={() => router.push('/diary')}
        className="text-xl mb-4 hover:bg-gray-300 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ←
      </button>
      <h1 className="text-2xl font-bold mb-4">나만의 이야기 작성하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">제목:</label>
          <input
            type="text"
            id="title"
            autoFocus
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
            rows={5}
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          저장하기
        </button>
      </form>
    </div>
  );
};

export default NewDiaryEntry;
