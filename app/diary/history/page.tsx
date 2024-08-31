// /diary/history/page.tsx
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import LineChart from '@/app/components/LineChart';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const HistoryPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Diary History</h1>
        <LineChart />
      </div>
    </QueryClientProvider>
  );
};

export default HistoryPage;
