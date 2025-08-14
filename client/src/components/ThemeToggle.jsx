import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-200 hover:bg-gray-300'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Toggle handle */}
      <span
        className={`
          inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isDarkMode ? 'translate-x-10' : 'translate-x-1'}
        `}
      >
        {/* Icon inside toggle */}
        <div className="flex h-full w-full items-center justify-center">
          {isDarkMode ? (
            <MoonIcon className="h-4 w-4 text-blue-600" />
          ) : (
            <SunIcon className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </span>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <SunIcon className={`h-4 w-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-yellow-500'
        }`} />
        <MoonIcon className={`h-4 w-4 transition-colors duration-300 ${
          isDarkMode ? 'text-blue-400' : 'text-gray-400'
        }`} />
      </div>
    </button>
  );
};

export default ThemeToggle; 