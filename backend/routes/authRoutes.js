const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin, rateLimiter } = require('../middleware/authMiddleware');

// Apply rate limiting to auth routes
const authRateLimiter = rateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes

// Public routes (no authentication required)
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

// Admin routes (admin role required)
router.get('/users', authenticateToken, requireAdmin, authController.getAllUsers);
router.put('/users/:userId/role', authenticateToken, requireAdmin, authController.updateUserRole);
router.put('/users/:userId/status', authenticateToken, requireAdmin, authController.toggleUserStatus);

module.exports = router;
