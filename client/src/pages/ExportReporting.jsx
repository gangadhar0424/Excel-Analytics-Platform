import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  DocumentArrowDownIcon, 
  PhotoIcon, 
  DocumentTextIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ExportReporting = () => {
  const [exportFormat, setExportFormat] = useState('png');
  const [reportType, setReportType] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const chartRef = useRef(null);
  const { files } = useSelector(state => state.files);
  const { showToast } = useToast();

  // Export chart as image
  const exportChartAsImage = async (chartElement, format = 'png') => {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === 'svg') {
        // Convert canvas to SVG (simplified)
        const svgData = canvas.toDataURL('image/svg+xml');
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.svg`;
        link.href = svgData;
        link.click();
      }
      
      showToast('Chart exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export chart', 'error');
      console.error('Export error:', error);
    }
  };

  // Export data as CSV/Excel
  const exportDataAsFile = async (data, format = 'csv') => {
    try {
      let content = '';
      let filename = `data-${Date.now()}`;
      let mimeType = '';

      if (format === 'csv') {
        // Convert data to CSV
        const headers = Object.keys(data[0] || {});
        content = headers.join(',') + '\n';
        content += data.map(row => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        ).join('\n');
        filename += '.csv';
        mimeType = 'text/csv';
      } else if (format === 'excel') {
        // For Excel, we'll use a simple CSV with .xlsx extension
        // In a real implementation, you'd use a library like xlsx
        const headers = Object.keys(data[0] || {});
        content = headers.join(',') + '\n';
        content += data.map(row => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        ).join('\n');
        filename += '.xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      showToast(`${format.toUpperCase()} file exported successfully!`, 'success');
    } catch (error) {
      showToast(`Failed to export ${format.toUpperCase()} file`, 'error');
      console.error('Export error:', error);
    }
  };

  // Generate PDF report
  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Excel Analytics Report', 20, 20);
      
      // Add timestamp
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      
      // Add summary
      pdf.setFontSize(14);
      pdf.text('Summary', 20, 50);
      pdf.setFontSize(12);
      pdf.text(`Total files uploaded: ${files.length}`, 20, 60);
      pdf.text(`Report type: ${reportType}`, 20, 70);
      
      // Add file list
      if (files.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Uploaded Files:', 20, 90);
        pdf.setFontSize(10);
        files.forEach((file, index) => {
          const y = 100 + (index * 10);
          if (y < 280) { // Prevent overflow
            pdf.text(`${index + 1}. ${file.originalName}`, 20, y);
          }
        });
      }
      
      // Save PDF
      pdf.save(`analytics-report-${Date.now()}.pdf`);
      showToast('PDF report generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate PDF report', 'error');
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate comprehensive report via API
  const generateComprehensiveReport = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/api/export-reporting/generate-report', {
        reportType,
        selectedCharts,
        includeData: true,
        format: 'pdf'
      });
      
      // Download the generated report
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprehensive-report-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      showToast('Comprehensive report generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate comprehensive report', 'error');
      console.error('Report generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Export & Reporting</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Export Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <PhotoIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Export Charts</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="png">PNG Image</option>
                <option value="svg">SVG Vector</option>
                <option value="pdf">PDF Document</option>
              </select>
            </div>
            
            <button
              onClick={() => exportChartAsImage(chartRef.current, exportFormat)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Chart
            </button>
          </div>
        </div>

        {/* Data Export Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <TableCellsIcon className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Export Data</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => exportDataAsFile(files, 'csv')}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Export as CSV
              </button>
              
              <button
                onClick={() => exportDataAsFile(files, 'excel')}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                Export as Excel
              </button>
            </div>
          </div>
        </div>

        {/* Report Generation Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
          <div className="flex items-center mb-4">
            <DocumentChartBarIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold">Generate Reports</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="summary">Summary Report</option>
                  <option value="detailed">Detailed Analysis</option>
                  <option value="comprehensive">Comprehensive Report</option>
                  <option value="executive">Executive Summary</option>
                </select>
              </div>
              
              <button
                onClick={generatePDFReport}
                disabled={isGenerating}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate PDF Report'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Advanced Options</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Include charts and visualizations
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Include data tables
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Include statistical analysis
                  </label>
                </div>
              </div>
              
              <button
                onClick={generateComprehensiveReport}
                disabled={isGenerating}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Comprehensive Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Sample Chart for Export Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Sample Chart for Export</h3>
          <div 
            ref={chartRef}
            className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">Chart</span>
              </div>
              <p className="text-gray-600">This is a sample chart area for export demonstration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReporting; 