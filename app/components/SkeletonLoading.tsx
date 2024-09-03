const SkeletonLoading = ({ isDiaryList = false }: { isDiaryList?: boolean }) => {
  return (
    <div className="space-y-4" style={{ animation: 'pulse 1.25s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      {Array.from({ length: isDiaryList ? 10 : 3 }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-300 rounded ${isDiaryList ? '' : 'h-6'}`}
          style={isDiaryList ? { height: '92px' } : {}}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoading;
