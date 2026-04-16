import SkeletonLoading from '@/app/components/SkeletonLoading';

export default function DiaryLoading() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">일기 목록</h1>
      <SkeletonLoading isDiaryList={true} />
    </div>
  );
}
