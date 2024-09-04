'use client';

import { Diary } from '@prisma/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchDiaries, deleteDiary } from '@/app/actions/diary';
import SkeletonLoading from '../components/SkeletonLoading';
import ConfirmModal from '../components/ConfirmModal';

const DiaryList = () => {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiaryId, setSelectedDiaryId] = useState<number | null>(null);

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

  const openModal = (id: number) => {
    setSelectedDiaryId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDiaryId(null);
  };

  const handleDeleteDiary = async () => {
    if (selectedDiaryId === null) return;
    try {
      await deleteDiary(selectedDiaryId);
      setDiaries(diaries.filter((diary) => diary.id !== selectedDiaryId));
      closeModal();
    } catch (error) {
      console.error('Failed to delete diary:', error);
    }
  };

  return (
    <div className="p-6 select-none">
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
              className="relative text-black rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-200"
            >
              <Link href={`/diary/${diary.id}`} className="rounded-lg block bg-white p-4 pr-12">
                <h2 className="text-xl font-semibold">{diary.title}</h2>
                <p className="text-gray-400 mt-2 truncate">{diary.content}</p>
              </Link>
              <button
                onClick={() => openModal(diary.id)}
                className="absolute top-4 right-4"
                aria-label="Delete diary"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteDiary}
      />
    </div>
  );
}

export default DiaryList;
