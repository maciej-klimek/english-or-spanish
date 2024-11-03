import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-start items-center mb-8">
      <div className="bg-stone-700 p-4 rounded-lg shadow-md max-w-[70%]">
        <p className="text-sm font-bold text-stone-400">Assistant:</p>
        <div className="flex items-center space-x-2 mt-2">
          <div className="loader border-b-4 border-lime-500 rounded-full w-5 h-5 animate-spin"></div>
          <span className="text-stone-300">Typing...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
