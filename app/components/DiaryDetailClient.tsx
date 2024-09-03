'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteDiary } from '@/app/actions/diary';
import { Diary } from '@prisma/client';
import { useQuery } from 'react-query';
import { searchYouTube } from '../actions/youtube';
import BarChart from './BarChart';
import { recommendMusic } from '../actions/music';
import LoadingSpinner from './LoadingSpinner';

const DiaryDetailClient = ({ diary }: { diary: Diary }) => {
  const router = useRouter();
  const { positive, negative, neutral } = diary;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const extractVideoId = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const { data: track, error: trackError, isLoading: trackLoading } = useQuery(
    ['track', diary.id],
    () => recommendMusic(diary.content),
    {
      enabled: !!diary,
      staleTime: 1000 * 60 * 60,
    }
  );

  const { data: videoId, error: videoError, isLoading: videoLoading } = useQuery(
    ['youtube', track],
    () => searchYouTube(track!.title, track!.artist),
    {
      enabled: !!track,
      select: (videoUrl) => extractVideoId(videoUrl),
      staleTime: 1000 * 60 * 60,
    }
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

  if (trackError) {
    return <div className="text-red-500">Failed to load track.</div>;
  }

  if (trackLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white max-w-2xl mx-auto p-6 rounded-xl shadow-lg">
      <button
        onClick={() => router.push('/diary')}
        className="text-xl mb-4 hover:bg-gray-300 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >←</button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{diary.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <em>{new Date(diary.createdAt).toLocaleDateString()}</em>
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
        <p className="text-gray-800">{diary.content}</p>
      </div>

      <BarChart sentimentScores={{ positive, negative, neutral }} />

      <div className="bg-green-50 border border-green-200 p-4 mt-6 rounded-lg shadow-sm">
        <h4 className="text-md font-semibold text-gray-900">{diary.advice}</h4>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-300 pb-2">
          🎵 이 일기에 딱 맞는 노래를 추천해 드려요!
        </h2>
        {videoLoading ? (
          <LoadingSpinner />
        ) : videoError ? (
          <div className="text-red-500 mt-4">Error occurred while fetching video data.</div>
        ) : (
          videoId && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded shadow-md"
              ></iframe>
            </div>
          )
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">정말로 이 일기를 삭제하시겠습니까?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryDetailClient;
