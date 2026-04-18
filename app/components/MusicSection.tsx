import { getMusicRecommendation } from '@/lib/data/music';

export default async function MusicSection({
  diaryId,
  diaryContent,
}: {
  diaryId: number;
  diaryContent: string;
}) {
  try {
    const { videoId } = await getMusicRecommendation(diaryId, diaryContent);

    if (!videoId) {
      return <div className="text-red-500 mt-4">음악을 찾을 수 없습니다.</div>;
    }

    return (
      <div className="mt-4">
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded shadow-md"
        />
      </div>
    );
  } catch {
    return <div className="text-red-500 mt-4">음악 추천을 불러올 수 없습니다.</div>;
  }
}
