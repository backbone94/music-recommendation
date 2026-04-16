'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { generateWeeklyAnalysis } from '@/app/actions/advice';
import { useRouter } from 'next/navigation';
import { Diary } from '@prisma/client';
import SkeletonLoading from './SkeletonLoading';

const LineChart = dynamic(() => import('./LineChart'), { ssr: false });

const HistoryClient = ({
  initialDiaries,
  initialAnalysis,
}: {
  initialDiaries: Diary[];
  initialAnalysis: string;
}) => {
  const router = useRouter();
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [showAnalysisButton, setShowAnalysisButton] = useState(!initialAnalysis);

  const combinedContent = useMemo(
    () => initialDiaries.map((diary) => diary.content).join('\n'),
    [initialDiaries]
  );

  const handleFetchAnalysis = async () => {
    if (initialDiaries.length === 0) return;
    try {
      setIsAnalysisLoading(true);
      setShowAnalysisButton(false);
      const result = await generateWeeklyAnalysis(combinedContent);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to fetch analysis data:', error);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg select-none">
      <button
        onClick={() => router.push('/diary')}
        className="mb-4 hover:bg-gray-300 text-gray-600 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ←
      </button>
      <LineChart diaries={initialDiaries} />
      {!analysis && showAnalysisButton && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleFetchAnalysis}
            className="px-6 py-3 mt-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
          >
            히스토리 분석
          </button>
        </div>
      )}
      {isAnalysisLoading && !analysis && (
        <div className="mt-8 mb-4 text-center text-gray-600">
          <p className="text-lg font-semibold mb-4">최근 일기를 분석하고 있어요! 잠시만 기다려 주세요 😊 (약 1분 소요)</p>
          <SkeletonLoading />
        </div>
      )}
      {analysis && (
        <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mt-4 mb-4 text-gray-700">💌 최근 일기에서 느껴진 감정들을 모아봤어요!</h2>
          <p className="text-gray-700 leading-relaxed">
            {analysis.split('\n').map((line, index) => (
              <span key={index} className="block mb-2 select-text">{line}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryClient;
