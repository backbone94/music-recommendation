const SkeletonLoading = () => {
  return (
    <div className="space-y-4" style={{ animation: 'pulse 1.25s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
    </div>
  );
}

export default SkeletonLoading;
