'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { deleteDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';
import dynamic from 'next/dynamic';
import { formatDate } from '@/lib/date';
import ConfirmModal from './ConfirmModal';

const BarChart = dynamic(() => import('./BarChart'), {
  ssr: false,
  loading: () => (
    <div className="h-80 max-w-xl mx-auto mt-8 p-4 rounded-lg shadow-2xl animate-pulse bg-gray-100" />
  ),
});

const DiaryDetailClient = ({
  diary,
  musicSection,
}: {
  diary: Diary;
  musicSection: React.ReactNode;
}) => {
  const router = useRouter();
  const { positive, negative, neutral } = diary;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sentimentScores = useMemo(
    () => ({ positive, negative, neutral }),
    [positive, negative, neutral]
  );

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
    <div className="bg-white max-w-2xl mx-auto p-6 rounded-xl shadow-lg select-none">
      <button
        onClick={() => router.push('/diary')}
        className="text-xl mb-4 hover:bg-gray-300 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >←</button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{diary.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <em>{formatDate(new Date(diary.createdAt))}</em>
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm"
          >
            수정
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
        <p className="text-gray-800 select-text">{diary.content}</p>
      </div>

      <BarChart sentimentScores={sentimentScores} />

      <div className="bg-green-50 border border-green-200 p-4 mt-6 rounded-lg shadow-sm">
        <h4 className="text-md font-semibold text-gray-900 select-text">{diary.advice}</h4>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
          🎵 이 일기에 딱 맞는 노래를 추천해 드려요!
        </h2>
        {musicSection}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DiaryDetailClient;
