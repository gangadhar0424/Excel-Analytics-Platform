import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const AdvancedAnalytics = () => {
  const { isDarkMode } = useTheme();
  const { files } = useSelector(state => state.files);
  const [selectedFile, setSelectedFile] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState(null);
  const [pivotTable, setPivotTable] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [customChart, setCustomChart] = useState({
    title: '',
    xAxis: '',
    yAxis: '',
    data: []
  });

  // Fallback icon component to prevent import errors
  const FallbackIcon = ({ className }) => (
    <div className={`${className} bg-gray-400 rounded`}></div>
  );

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: ChartBarIcon || FallbackIcon },
    { id: 'line', name: 'Line Chart', icon: ChartBarIcon || FallbackIcon },
    { id: 'pie', name: 'Pie Chart', icon: ChartBarIcon || FallbackIcon },
    { id: 'doughnut', name: 'Doughnut Chart', icon: ChartBarIcon || FallbackIcon },
    { id: 'radar', name: 'Radar Chart', icon: ChartBarIcon || FallbackIcon },
    { id: 'scatter', name: 'Scatter Plot', icon: ChartBarIcon || FallbackIcon }
  ];

  useEffect(() => {
    if (selectedFile && files && files.length > 0) {
      const file = files.find(f => f.fileName === selectedFile);
      if (file && file.data) {
        generateStatistics(file.data);
        generatePivotTable(file.data);
        generateSampleChart(file.data);
      }
    }
  }, [selectedFile, files]);

  const generateStatistics = (data) => {
    if (!data || data.length === 0) return;
    
    const numericColumns = Object.keys(data[0]).filter(key => 
      !isNaN(data[0][key]) && data[0][key] !== ''
    );

    const stats = {};
    numericColumns.forEach(col => {
      const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
      if (values.length > 0) {
        stats[col] = {
          mean: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
          median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)].toFixed(2),
          min: Math.min(...values).toFixed(2),
          max: Math.max(...values).toFixed(2),
          count: values.length
        };
      }
    });
    setStatistics(stats);
  };

  const generatePivotTable = (data) => {
    if (!data || data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const pivotData = columns.map(col => ({
      column: col,
      uniqueValues: [...new Set(data.map(row => row[col]))].length,
      sampleValues: [...new Set(data.map(row => row[col]))].slice(0, 3)
    }));
    
    setPivotTable(pivotData);
  };

  const generateSampleChart = (data) => {
    if (!data || data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const numericColumns = columns.filter(key => 
      !isNaN(data[0][key]) && data[0][key] !== ''
    );
    
    if (numericColumns.length >= 2) {
      const xCol = numericColumns[0];
      const yCol = numericColumns[1];
      
      const chartData = {
        labels: data.slice(0, 10).map(row => row[xCol]),
        datasets: [{
          label: yCol,
          data: data.slice(0, 10).map(row => parseFloat(row[yCol])),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2
        }]
      };
      
      setChartData(chartData);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDarkMode ? '#f3f4f6' : '#374151'
          }
        },
        title: {
          display: true,
          text: customChart.title || 'Data Visualization',
          color: isDarkMode ? '#f3f4f6' : '#374151'
        }
      },
      scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
        x: {
          ticks: { color: isDarkMode ? '#f3f4f6' : '#374151' },
          grid: { color: isDarkMode ? '#374151' : '#e5e7eb' }
        },
        y: {
          ticks: { color: isDarkMode ? '#f3f4f6' : '#374151' },
          grid: { color: isDarkMode ? '#374151' : '#e5e7eb' }
        }
      } : {}
    };

    const chartProps = {
      data: chartData,
      options: options
    };

    switch (chartType) {
      case 'line':
        return <Line {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'radar':
        return <Radar {...chartProps} />;
      case 'scatter':
        return <Scatter {...chartProps} />;
      default:
        return <Bar {...chartProps} />;
    }
  };

  const exportChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${chartType}-chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🚀 Advanced Analytics & Visualization
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create custom charts, analyze statistics, and build pivot tables
          </p>
        </div>

        {/* File Selection */}
        <div className={`p-6 rounded-xl mb-8 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Select Data Source</h2>
          <select
            value={selectedFile || ''}
            onChange={(e) => setSelectedFile(e.target.value)}
            className={`w-full p-3 border rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Choose a file to analyze</option>
            {files && files.map(file => (
              <option key={file.fileName} value={file.fileName}>
                {file.fileName}
              </option>
            ))}
          </select>
        </div>

        {selectedFile && (
          <>
            {/* Chart Builder */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">📊 Custom Chart Builder</h2>
                <button
                  onClick={exportChart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                                     {DocumentArrowDownIcon ? <DocumentArrowDownIcon className="h-5 w-5" /> : <FallbackIcon className="h-5 w-5" />}
                   <span>Export Chart</span>
                </button>
              </div>

              {/* Chart Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {chartTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setChartType(type.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      chartType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                                         {type.icon ? <type.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" /> : <FallbackIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />}
                     <span className="text-sm font-medium">{type.name}</span>
                  </button>
                ))}
              </div>

              {/* Chart Display */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                {chartData ? (
                  <div className="h-96">
                    {renderChart()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                                         {ChartBarIcon ? <ChartBarIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" /> : <FallbackIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />}
                     <p className="text-gray-500 dark:text-gray-400">
                       Select a file and chart type to generate visualization
                     </p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">📈 Statistical Summary</h2>
              {Object.keys(statistics).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(statistics).map(([column, stats]) => (
                    <div key={column} className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <h3 className="font-semibold mb-3 text-blue-600">{column}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mean:</span>
                          <span className="font-mono">{stats.mean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Median:</span>
                          <span className="font-mono">{stats.median}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Min:</span>
                          <span className="font-mono">{stats.min}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max:</span>
                          <span className="font-mono">{stats.max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Count:</span>
                          <span className="font-mono">{stats.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No numeric data found for statistical analysis
                </p>
              )}
            </div>

            {/* Pivot Table */}
            <div className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">📋 Data Overview</h2>
              {pivotTable ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <th className="text-left p-3">Column</th>
                        <th className="text-left p-3">Unique Values</th>
                        <th className="text-left p-3">Sample Values</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pivotTable.map((row, index) => (
                        <tr key={index} className={`border-b ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-100'
                        }`}>
                          <td className="p-3 font-medium">{row.column}</td>
                          <td className="p-3">{row.uniqueValues}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {row.sampleValues.map((value, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-1 text-xs rounded ${
                                    isDarkMode 
                                      ? 'bg-gray-700 text-gray-300' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {String(value).substring(0, 20)}
                                  {String(value).length > 20 ? '...' : ''}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No data available for pivot table
                </p>
              )}
            </div>
          </>
        )}

        {/* Getting Started */}
        {!selectedFile && (
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h3 className="text-lg font-semibold mb-3 text-blue-600">
              💡 Getting Started with Advanced Analytics
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>• Upload an Excel file to begin analysis</li>
              <li>• Choose from 6 different chart types</li>
              <li>• View statistical summaries of numeric columns</li>
              <li>• Explore data structure with pivot tables</li>
              <li>• Export charts as images for presentations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 