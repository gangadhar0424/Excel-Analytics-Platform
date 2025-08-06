const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

// Admin routes (admin role required)
router.get('/users', authenticateToken, authController.getAllUsers);
router.put('/users/:userId/role', authenticateToken, authController.updateUserRole);
router.put('/users/:userId/status', authenticateToken, authController.toggleUserStatus);

module.exports = router;
