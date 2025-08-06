import React, { useState, useRef } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  DocumentArrowDownIcon, 
  PhotoIcon, 
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTheme } from '../contexts/ThemeContext';

// Register Chart.js components and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = [
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Line Chart', value: 'line' },
  { label: 'Pie Chart', value: 'pie' },
  { label: 'Scatter Plot', value: 'scatter' },
  // Add 3D chart options as needed
];

const colorPalette = [
  '#7c3aed', '#a78bfa', '#c4b5fd', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#facc15', '#4ade80',
  '#6366f1', '#f59e42', '#10b981', '#ef4444', '#eab308', '#3b82f6', '#8b5cf6', '#f472b6', '#22d3ee', '#f43f5e'
];

const ChartViewer = ({ columns = [], data = [] }) => {
  const { isDarkMode } = useTheme();
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState(columns[0] || '');
  const [yAxis, setYAxis] = useState(columns[1] || '');
  const [showChart, setShowChart] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef(null);

  const getChartData = () => {
    if (!xAxis || !yAxis) return { labels: [], datasets: [] };
    if (chartType === 'scatter') {
      return {
        datasets: [
          {
            label: `${yAxis} vs ${xAxis}`,
            data: data.map((row, i) => ({ x: row[xAxis], y: row[yAxis] })),
            backgroundColor: colorPalette.slice(0, data.length),
            borderColor: colorPalette.slice(0, data.length),
            pointRadius: 6,
          },
        ],
      };
    } else if (chartType === 'pie') {
      return {
        labels: data.map(row => row[xAxis]),
        datasets: [
          {
            label: yAxis,
            data: data.map(row => row[yAxis]),
            backgroundColor: colorPalette.slice(0, data.length),
            borderColor: colorPalette.slice(0, data.length),
            borderWidth: 2,
          },
        ],
      };
    } else {
      // bar, line
      return {
        labels: data.map(row => row[xAxis]),
        datasets: [
          {
            label: yAxis,
            data: data.map(row => row[yAxis]),
            backgroundColor: colorPalette.slice(0, data.length),
            borderColor: colorPalette.slice(0, data.length),
            borderWidth: 2,
          },
        ],
      };
    }
  };

  // Export chart as image
  const exportChartAsImage = async (format = 'png') => {
    if (!showChart || xAxis === yAxis) {
      alert('Please create a chart first and ensure X and Y axes are different');
      return;
    }
    
    setIsExporting(true);
    try {
      const chartElement = chartRef.current;
      if (!chartElement) {
        throw new Error('Chart element not found');
      }

      const canvas = await html2canvas(chartElement, {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${chartType}-chart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (format === 'svg') {
        // Convert canvas to SVG (simplified)
        const svgData = canvas.toDataURL('image/svg+xml');
        const link = document.createElement('a');
        link.download = `${chartType}-chart-${Date.now()}.svg`;
        link.href = svgData;
        link.click();
      }
      
      // Show success message
      console.log(`Chart exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export chart. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export chart as PDF
  const exportChartAsPDF = async () => {
    if (!showChart || xAxis === yAxis) {
      alert('Please create a chart first and ensure X and Y axes are different');
      return;
    }
    
    setIsExporting(true);
    try {
      const chartElement = chartRef.current;
      if (!chartElement) {
        throw new Error('Chart element not found');
      }

      const canvas = await html2canvas(chartElement, {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(`${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart Analysis`, 20, 20);
      
      // Add chart info
      pdf.setFontSize(12);
      pdf.text(`X-Axis: ${xAxis}`, 20, 35);
      pdf.text(`Y-Axis: ${yAxis}`, 20, 45);
      pdf.text(`Data Points: ${data.length}`, 20, 55);
      
      // Add chart image
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 70, imgWidth, imgHeight);
      
      // Save PDF
      pdf.save(`${chartType}-chart-analysis-${Date.now()}.pdf`);
      
      console.log('Chart exported as PDF successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export chart as PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export data as CSV
  const exportDataAsCSV = () => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }
    
    try {
      const headers = Object.keys(data[0] || {});
      let csvContent = headers.join(',') + '\n';
      csvContent += data.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-data-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      console.log('Data exported as CSV successfully!');
    } catch (error) {
      console.error('CSV export error:', error);
      alert('Failed to export data as CSV. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      {/* Chart Config */}
      <div className={`rounded-xl shadow-lg p-6 w-full lg:w-1/2 ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Create a New Chart
        </h3>
        <div className="mb-4">
          <label className={`block mb-1 font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Chart Type
          </label>
          <select
            className={`w-full border rounded px-3 py-2 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={chartType}
            onChange={e => setChartType(e.target.value)}
          >
            {chartTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block mb-1 font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Select X-Axis
          </label>
          <select
            className={`w-full border rounded px-3 py-2 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={xAxis}
            onChange={e => setXAxis(e.target.value)}
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block mb-1 font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Select Y-Axis
          </label>
          <select
            className={`w-full border rounded px-3 py-2 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={yAxis}
            onChange={e => setYAxis(e.target.value)}
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        {xAxis === yAxis && xAxis && (
          <div className="text-red-500 mb-2">X axis and Y axis cannot be the same. Please select different columns.</div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setShowChart(true)}
          >
            Show Analysis
          </button>
          
          {showChart && !(xAxis === yAxis && xAxis) && (
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600 transition flex items-center justify-center text-sm"
                onClick={() => exportChartAsImage('png')}
                disabled={isExporting}
              >
                <PhotoIcon className="h-4 w-4 mr-1" />
                PNG
              </button>
              <button
                className="bg-purple-500 text-white py-2 px-3 rounded hover:bg-purple-600 transition flex items-center justify-center text-sm"
                onClick={() => exportChartAsImage('svg')}
                disabled={isExporting}
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                SVG
              </button>
              <button
                className="bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition flex items-center justify-center text-sm"
                onClick={exportChartAsPDF}
                disabled={isExporting}
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                PDF
              </button>
              <button
                className="bg-orange-500 text-white py-2 px-3 rounded hover:bg-orange-600 transition flex items-center justify-center text-sm"
                onClick={exportDataAsCSV}
                disabled={isExporting}
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                CSV
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Chart Display */}
      <div 
        ref={chartRef}
        className={`rounded-xl shadow-lg p-6 w-full lg:w-1/2 flex items-center justify-center min-h-[400px] ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
      >
        {showChart ? (
          xAxis === yAxis && xAxis ? (
            <div className="text-red-500 text-center">X axis and Y axis cannot be the same. Please select different columns.</div>
          ) : chartType === 'bar' ? <Bar data={getChartData()} /> :
            chartType === 'line' ? <Line data={getChartData()} /> :
            chartType === 'pie' ? <Pie data={getChartData()} /> :
            chartType === 'scatter' ? <Scatter data={getChartData()} /> :
            <div className={`text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Chart type not supported yet.
            </div>
        ) : (
          <div className={`text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-6xl mb-4">📊</div>
            <p>Select chart options and click "Show Analysis" to create your chart</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartViewer;
