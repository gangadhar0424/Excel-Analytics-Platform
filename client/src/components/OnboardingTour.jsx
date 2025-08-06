import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const OnboardingTour = ({ isOpen, onClose, onComplete }) => {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Excel Analytics Platform!',
      description: 'Let\'s take a quick tour to help you get started with analyzing your Excel files.',
      image: '/images/tour-welcome.svg',
      position: 'center'
    },
    {
      title: 'Upload Your Excel Files',
      description: 'Start by uploading your Excel files (.xlsx, .xls, .csv). Our platform supports multiple file formats and will automatically parse your data.',
      image: '/images/tour-upload.svg',
      position: 'top'
    },
    {
      title: 'Create Beautiful Charts',
      description: 'Choose from various chart types including bar charts, line charts, pie charts, and scatter plots. Customize your visualizations with different axes and colors.',
      image: '/images/tour-charts.svg',
      position: 'center'
    },
    {
      title: 'Export and Share',
      description: 'Export your charts as PNG, SVG, PDF, or CSV files. Share your insights with your team or download for presentations.',
      image: '/images/tour-export.svg',
      position: 'bottom'
    },
    {
      title: 'Advanced Features',
      description: 'Explore advanced analytics, data cleaning tools, collaboration features, and AI-powered insights to take your analysis to the next level.',
      image: '/images/tour-advanced.svg',
      position: 'center'
    },
    {
      title: 'You\'re All Set!',
      description: 'You\'re ready to start analyzing your data. Remember, you can always access help and tutorials from the menu.',
      image: '/images/tour-complete.svg',
      position: 'center'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Tour Modal */}
      <div className={`
        relative mx-4 max-w-md w-full rounded-2xl shadow-2xl transition-all duration-300
        ${isDarkMode 
          ? 'bg-gray-800 text-white border border-gray-700' 
          : 'bg-white text-gray-900 border border-gray-200'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{currentStep + 1}</span>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className={`
              p-2 rounded-full transition-colors
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-3 text-center">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
            {currentStepData.description}
          </p>
          
          {/* Placeholder for image */}
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-2xl">📊</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Feature Preview
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
              ${currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full transition-colors
                  ${index === currentStep
                    ? 'bg-blue-500'
                    : isDarkMode
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                  }
                `}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            {currentStep < steps.length - 1 && <ChevronRightIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour; 