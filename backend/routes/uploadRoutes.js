const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const uploadController = require('../controllers/uploadController');

// POST /api/upload - upload and parse Excel file
router.post('/', authenticateToken, uploadController.upload.single('file'), uploadController.uploadExcel);

// GET /api/upload/files - get uploaded files for the authenticated user
router.get('/files', authenticateToken, uploadController.getFiles);

module.exports = router; 