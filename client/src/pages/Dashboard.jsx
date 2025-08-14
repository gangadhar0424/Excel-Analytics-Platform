import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon,
  SparklesIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
  ChartPieIcon,
  CpuChipIcon,
  BellIcon,
  ShieldCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { isDarkMode } = useTheme();
  const [recentFiles, setRecentFiles] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCharts: 0,
    totalExports: 0
  });

  useEffect(() => {
    // Simulate loading recent files and stats
    setRecentFiles([
      { id: 1, name: 'Sales Data 2024.xlsx', uploadedAt: '2024-01-15', size: '2.3 MB' },
      { id: 2, name: 'Customer Analytics.csv', uploadedAt: '2024-01-14', size: '1.8 MB' },
      { id: 3, name: 'Financial Report.xlsx', uploadedAt: '2024-01-13', size: '3.1 MB' }
    ]);
    
    setStats({
      totalFiles: 12,
      totalCharts: 28,
      totalExports: 15
    });
  }, []);

  const features = [
    {
      title: 'Upload & Analyze',
      description: 'Upload Excel files and create beautiful charts',
      icon: CloudArrowUpIcon,
      href: '/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'Advanced Analytics',
      description: 'Explore advanced visualization options',
      icon: ChartPieIcon,
      href: '/advanced-analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Data Cleaning',
      description: 'Clean and prepare your data for analysis',
      icon: SparklesIcon,
      href: '/data-cleaning',
      color: 'bg-green-500'
    },
    {
      title: 'Export & Report',
      description: 'Export charts and generate reports',
      icon: DocumentArrowDownIcon,
      href: '/export-reporting',
      color: 'bg-orange-500'
    },
    {
      title: 'Collaboration',
      description: 'Share and collaborate with your team',
      icon: ShareIcon,
      href: '/collaboration',
      color: 'bg-indigo-500'
    },
    {
      title: 'AI Features',
      description: 'AI-powered insights and automation',
      icon: CpuChipIcon,
      href: '/ai-features',
      color: 'bg-pink-500'
    }
  ];

  const quickActions = [
    { name: 'Upload New File', href: '/upload', icon: CloudArrowUpIcon },
    { name: 'View Recent Files', href: '/uploaded-files', icon: DocumentTextIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.username || 'User'}! 👋
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ready to analyze your data? Let's create some amazing visualizations.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-xl shadow-soft transition-colors ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Files
                </p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalFiles}</p>
        </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-soft transition-colors ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Charts Created
                </p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCharts}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-soft transition-colors ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Exports
                </p>
                <p className="text-3xl font-bold text-green-600">{stats.totalExports}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DocumentArrowDownIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <action.icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{action.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Explore Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.href}
                className={`group p-6 rounded-xl border transition-all duration-200 hover:shadow-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 group-hover:text-blue-600 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Files
          </h2>
          <div className={`rounded-xl border overflow-hidden ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {recentFiles.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentFiles.map((file) => (
                  <div key={file.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {file.name}
                          </p>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {file.size} • Uploaded {file.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/analyze/${file.id}`}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Analyze
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  No files uploaded yet
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Upload your first Excel file to get started
                </p>
                <Link
                  to="/upload"
                  className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Upload File
                </Link>
          </div>
        )}
          </div>
        </div>

        {/* Getting Started Tips */}
        <div className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-blue-900'
          }`}>
            💡 Getting Started Tips
          </h3>
          <ul className={`space-y-2 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-blue-800'
          }`}>
            <li>• Upload Excel files (.xlsx, .xls, .csv) to start analyzing</li>
            <li>• Create different chart types to visualize your data</li>
            <li>• Export your charts as images or PDFs for presentations</li>
            <li>• Use data cleaning tools to prepare your data</li>
            <li>• Share your insights with team members</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
