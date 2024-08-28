'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import DiaryDetailClient from './DiaryDetailClient';
import { Diary } from '@prisma/client';

const queryClient = new QueryClient();

const DiaryDetailClientWrapper = ({ diary }: { diary: Diary }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DiaryDetailClient diary={diary} />
    </QueryClientProvider>
  );
};

export default DiaryDetailClientWrapper;
