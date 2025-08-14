const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Placeholder route for notifications features
router.get('/placeholder', authenticateToken, notificationsController.placeholder);

module.exports = router; 