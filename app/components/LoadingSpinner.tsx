const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-16 h-16 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
