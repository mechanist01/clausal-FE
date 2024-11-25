import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="inline-block relative w-20 h-20">
        <div className="animate-spin absolute w-16 h-16 rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
      <p className="mt-4 text-gray-600">Analyzing your contract...</p>
    </div>
  );
};

export default LoadingSpinner;