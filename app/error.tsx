'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <p className="text-lg text-gray-700">문제가 발생했어요.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        다시 시도
      </button>
    </div>
  );
}
