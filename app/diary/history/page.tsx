'use client';

import React, { useEffect, useState } from 'react';
import LineChart from '@/app/components/LineChart';
import { fetchDiaries } from '@/app/actions/diary';
import { getWeeklyAnalysis } from '@/app/actions/advice';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { Diary } from '@prisma/client';
import SkeletonLoading from '@/app/components/SkeletonLoading';

const HistoryPage = () => {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [isDiariesLoading, setIsDiariesLoading] = useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  useEffect(() => {
    const getDiaries = async () => {
      try {
        const diariesData = await fetchDiaries(7);
        setDiaries(diariesData);
      } catch (error) {
        console.error('Failed to fetch diaries data:', error);
      } finally {
        setIsDiariesLoading(false);
      }
    };

    getDiaries();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (diaries.length === 0) return;

      try {
        setIsAnalysisLoading(true);
        const combinedContent = diaries.map(diary => diary.content).join('\n');
        const analysisData = await getWeeklyAnalysis(combinedContent);
        setAnalysis(analysisData);
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
      } finally {
        setIsAnalysisLoading(false);
      }
    };

    fetchAnalysis();
  }, [diaries]);

  if (isDiariesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <button
        onClick={() => router.push('/diary')}
        className="mb-4 hover:bg-gray-300 text-gray-600 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ←
      </button>
      <LineChart diaries={diaries} />
      {isAnalysisLoading ? (
        <div className="mt-8 mb-4 text-center text-gray-600">
          <p className="text-lg font-semibold mb-4">최근 일기를 분석하고 있어요! 잠시만 기다려 주세요 😊</p>
          <SkeletonLoading />
        </div>
      ) : (
        <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mt-4 mb-4 text-gray-700">💌 최근 일기에서 느껴진 감정들을 모아봤어요!</h2>
          <p className="text-gray-700 leading-relaxed">
            {analysis.split('\n').map((line, index) => (
              <span key={index} className="block mb-2">
                {line}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
