const express = require('express');
const router = express.Router();
const aiFeaturesController = require('../controllers/aiFeaturesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Placeholder route for AI-powered features
router.get('/placeholder', authenticateToken, aiFeaturesController.placeholder);

module.exports = router; 