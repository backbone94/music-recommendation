import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
