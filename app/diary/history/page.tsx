'use client';

import React, { useEffect, useMemo, useState } from 'react';
import LineChart from '@/app/components/LineChart';
import { fetchDiaries } from '@/app/actions/diary';
import { generateWeeklyAnalysis, getWeeklyAnalysis } from '@/app/actions/advice';
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
  const [showAnalysisButton, setShowAnalysisButton] = useState(true);

  useEffect(() => {
    const getDiaries = async () => {
      try {
        const diariesData = await fetchDiaries(7);
        setDiaries(diariesData);
        const cachedAnalysis = await getWeeklyAnalysis();
        if (cachedAnalysis) {
          setAnalysis(cachedAnalysis);
          setShowAnalysisButton(false);
        }
      } catch (error) {
        console.error('Failed to fetch diaries data:', error);
      } finally {
        setIsDiariesLoading(false);
      }
    };

    getDiaries();
  }, []);

  // diaries가 바뀔 때만 재계산 — isAnalysisLoading 등 state 변화로 리렌더될 때
  // diaries.map().join() 연산이 불필요하게 재실행되는 것을 방지
  const combinedContent = useMemo(
    () => diaries.map((diary) => diary.content).join('\n'),
    [diaries]
  );

  const handleFetchAnalysis = async () => {
    if (diaries.length === 0) return;

    try {
      setIsAnalysisLoading(true);
      setShowAnalysisButton(false);
      const analysis = await generateWeeklyAnalysis(combinedContent);
      setAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch analysis data:', error);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  if (isDiariesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg select-none">
      <button
        onClick={() => router.push('/diary')}
        className="mb-4 hover:bg-gray-300 text-gray-600 transition duration-200 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ←
      </button>
      <LineChart diaries={diaries} />
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

export default HistoryPage;
