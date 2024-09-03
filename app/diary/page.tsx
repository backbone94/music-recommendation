'use client';

import { Diary } from '@prisma/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchDiaries } from '@/app/actions/diary';
import SkeletonLoading from '../components/SkeletonLoading';

const DiaryList = () => {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, 300);

    const getDiaries = async () => {
      try {
        const data = await fetchDiaries();
        setDiaries(data);
      } catch (error) {
        console.error('Failed to fetch diaries:', error);
      } finally {
        clearTimeout(timer);
        setIsLoading(false);
      }
    };

    getDiaries();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">일기 목록</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => router.push('/diary/new')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          일기 쓰기
        </button>
        <button
          onClick={() => router.push('/diary/history')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
        >
          감정 히스토리
        </button>
      </div>
      {isLoading && showSkeleton ? (
        <SkeletonLoading isDiaryList={true} />
      ) : (
        <ul className="space-y-4">
          {diaries.map((diary) => (
            <li
              key={diary.id}
              className="text-pink-500 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-200"
            >
              <Link href={`/diary/${diary.id}`} className="rounded-lg block bg-white p-4">
                <h2 className="text-xl font-semibold select-none">{diary.title}</h2>
                <p className="text-gray-400 mt-2 truncate select-none">{diary.content}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DiaryList;
