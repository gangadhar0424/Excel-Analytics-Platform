import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      primary: isDarkMode ? '#3B82F6' : '#2563EB',
      secondary: isDarkMode ? '#6B7280' : '#4B5563',
      background: isDarkMode ? '#111827' : '#FFFFFF',
      surface: isDarkMode ? '#1F2937' : '#F9FAFB',
      text: isDarkMode ? '#F9FAFB' : '#111827',
      textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
      border: isDarkMode ? '#374151' : '#E5E7EB',
      success: isDarkMode ? '#10B981' : '#059669',
      warning: isDarkMode ? '#F59E0B' : '#D97706',
      error: isDarkMode ? '#EF4444' : '#DC2626',
      info: isDarkMode ? '#3B82F6' : '#2563EB'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 