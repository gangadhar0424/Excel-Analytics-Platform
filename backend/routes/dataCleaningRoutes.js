const express = require('express');
const router = express.Router();
const dataCleaningController = require('../controllers/dataCleaningController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Placeholder route for data cleaning tools
router.get('/placeholder', authenticateToken, dataCleaningController.placeholder);

module.exports = router; 