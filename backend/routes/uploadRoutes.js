const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const uploadController = require('../controllers/uploadController');

// POST /api/upload - upload and parse Excel file
router.post('/', authenticateToken, uploadController.upload.single('file'), uploadController.uploadExcel);

module.exports = router; 