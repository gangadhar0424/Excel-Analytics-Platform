import React from 'react';
import { ChartBarSquareIcon } from '@heroicons/react/24/outline';

const LandingPopup = ({ onStartAnalyzing }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center transform scale-100 transition-all duration-300 ease-out border-4 border-blue-500">
        <ChartBarSquareIcon className="h-24 w-24 text-blue-600 mx-auto mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🚀 Welcome to Excel Analytics!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Unlock insights from your data with powerful visualizations and analytics tools.
        </p>
        <button
          onClick={onStartAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-300 text-xl shadow-2xl hover:shadow-blue-500/50"
        >
          🎯 Start Analyzing
        </button>
        <div className="mt-4 text-sm text-gray-500">
          Click the button above to begin your journey
        </div>
      </div>
    </div>
  );
};

export default LandingPopup;
