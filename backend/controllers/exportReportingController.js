const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Export chart as image (placeholder for server-side image generation)
const exportChartAsImage = async (req, res) => {
  try {
    const { chartData, format = 'png' } = req.body;
    
    // In a real implementation, you would use a library like Puppeteer or Canvas
    // to generate images server-side. For now, we'll return a success response.
    
    res.json({
      success: true,
      message: `Chart exported as ${format.toUpperCase()}`,
      data: {
        format,
        timestamp: new Date().toISOString(),
        filename: `chart-${Date.now()}.${format}`
      }
    });
  } catch (error) {
    console.error('Chart export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export chart',
      error: error.message
    });
  }
};

// Export data as CSV/Excel
const exportDataAsFile = async (req, res) => {
  try {
    const { data, format = 'csv', filename = 'export' } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }

    let workbook;
    let fileExtension;
    let mimeType;

    if (format === 'excel') {
      // Create Excel workbook
      workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      fileExtension = 'xlsx';
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else {
      // Create CSV
      const csvContent = XLSX.utils.json_to_csv(data);
      workbook = csvContent;
      fileExtension = 'csv';
      mimeType = 'text/csv';
    }

    const fileName = `${filename}-${Date.now()}.${fileExtension}`;
    
    // Write file to uploads directory
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, fileName);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    if (format === 'excel') {
      XLSX.writeFile(workbook, filePath);
    } else {
      fs.writeFileSync(filePath, workbook);
    }

    res.json({
      success: true,
      message: `Data exported as ${format.toUpperCase()}`,
      data: {
        filename: fileName,
        format,
        downloadUrl: `/api/export-reporting/download/${fileName}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};

// Download exported file
const downloadExportedFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const ext = path.extname(filename).toLowerCase();
    let mimeType = 'application/octet-stream';
    
    if (ext === '.csv') {
      mimeType = 'text/csv';
    } else if (ext === '.xlsx') {
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message
    });
  }
};

// Generate comprehensive report
const generateComprehensiveReport = async (req, res) => {
  try {
    const { reportType, selectedCharts, includeData, format } = req.body;
    const userId = req.user.userId;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate report content
    const reportContent = await generateReportContent(user, reportType, selectedCharts, includeData);
    
    if (format === 'pdf') {
      // In a real implementation, you would use a library like Puppeteer or jsPDF
      // to generate PDF server-side. For now, we'll return the report data.
      
      res.json({
        success: true,
        message: 'Comprehensive report generated',
        data: {
          reportType,
          content: reportContent,
          timestamp: new Date().toISOString(),
          filename: `comprehensive-report-${Date.now()}.pdf`
        }
      });
    } else {
      res.json({
        success: true,
        message: 'Report generated',
        data: reportContent
      });
    }
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

// Generate report content
const generateReportContent = async (user, reportType, selectedCharts, includeData) => {
  const report = {
    title: 'Excel Analytics Platform Report',
    generatedAt: new Date().toISOString(),
    user: {
      username: user.username,
      email: user.email
    },
    summary: {
      totalFiles: user.uploadHistory?.length || 0,
      totalCharts: user.uploadHistory?.reduce((sum, file) => 
        sum + (file.chartConfigs?.length || 0), 0) || 0,
      reportType
    },
    files: user.uploadHistory || [],
    charts: selectedCharts || [],
    analysis: {}
  };

  // Add analysis based on report type
  switch (reportType) {
    case 'summary':
      report.analysis = {
        type: 'Summary Report',
        description: 'Overview of uploaded files and basic analytics',
        highlights: [
          `Total files uploaded: ${report.summary.totalFiles}`,
          `Total charts created: ${report.summary.totalCharts}`,
          `User since: ${new Date(user.createdAt).toLocaleDateString()}`
        ]
      };
      break;
      
    case 'detailed':
      report.analysis = {
        type: 'Detailed Analysis',
        description: 'Comprehensive analysis of all uploaded data',
        fileDetails: user.uploadHistory?.map(file => ({
          name: file.originalName,
          size: file.fileSize,
          uploadDate: file.uploadDate,
          charts: file.chartConfigs?.length || 0
        })) || []
      };
      break;
      
    case 'comprehensive':
      report.analysis = {
        type: 'Comprehensive Report',
        description: 'Complete analysis with statistical insights',
        statistics: {
          averageFileSize: user.uploadHistory?.length > 0 
            ? user.uploadHistory.reduce((sum, file) => sum + file.fileSize, 0) / user.uploadHistory.length 
            : 0,
          mostActiveMonth: getMostActiveMonth(user.uploadHistory),
          chartTypes: getChartTypeDistribution(user.uploadHistory)
        }
      };
      break;
      
    case 'executive':
      report.analysis = {
        type: 'Executive Summary',
        description: 'High-level overview for executive review',
        keyMetrics: {
          totalDataProcessed: user.uploadHistory?.length || 0,
          averageChartsPerFile: user.uploadHistory?.length > 0 
            ? user.uploadHistory.reduce((sum, file) => sum + (file.chartConfigs?.length || 0), 0) / user.uploadHistory.length 
            : 0,
          userEngagement: calculateUserEngagement(user)
        }
      };
      break;
  }

  return report;
};

// Helper functions
const getMostActiveMonth = (uploadHistory) => {
  if (!uploadHistory || uploadHistory.length === 0) return 'No data';
  
  const monthCounts = {};
  uploadHistory.forEach(file => {
    const month = new Date(file.uploadDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  
  return Object.entries(monthCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
};

const getChartTypeDistribution = (uploadHistory) => {
  if (!uploadHistory) return {};
  
  const chartTypes = {};
  uploadHistory.forEach(file => {
    file.chartConfigs?.forEach(chart => {
      chartTypes[chart.chartType] = (chartTypes[chart.chartType] || 0) + 1;
    });
  });
  
  return chartTypes;
};

const calculateUserEngagement = (user) => {
  const daysSinceCreation = Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24));
  const filesPerDay = daysSinceCreation > 0 ? (user.uploadHistory?.length || 0) / daysSinceCreation : 0;
  
  if (filesPerDay > 0.5) return 'High';
  if (filesPerDay > 0.1) return 'Medium';
  return 'Low';
};

// Get export history for user
const getExportHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real implementation, you would store export history in the database
    // For now, we'll return a placeholder
    res.json({
      success: true,
      data: {
        exports: [],
        totalExports: 0
      }
    });
  } catch (error) {
    console.error('Get export history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get export history',
      error: error.message
    });
  }
};

module.exports = {
  exportChartAsImage,
  exportDataAsFile,
  downloadExportedFile,
  generateComprehensiveReport,
  getExportHistory
}; 