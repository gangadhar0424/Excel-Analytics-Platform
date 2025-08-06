const express = require('express');
const router = express.Router();
const exportReportingController = require('../controllers/exportReportingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Chart export routes
router.post('/export-chart', authenticateToken, exportReportingController.exportChartAsImage);

// Data export routes
router.post('/export-data', authenticateToken, exportReportingController.exportDataAsFile);
router.get('/download/:filename', authenticateToken, exportReportingController.downloadExportedFile);

// Report generation routes
router.post('/generate-report', authenticateToken, exportReportingController.generateComprehensiveReport);
router.get('/export-history', authenticateToken, exportReportingController.getExportHistory);

module.exports = router; 