const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// File and chart sharing routes
router.post('/share', authenticateToken, collaborationController.shareItem);
router.get('/shared-items', authenticateToken, collaborationController.getSharedItems);
router.post('/generate-link', authenticateToken, collaborationController.generateShareLink);
router.delete('/shared-items/:shareId', authenticateToken, collaborationController.revokeAccess);

// Team workspace routes
router.post('/teams', authenticateToken, collaborationController.createTeam);
router.get('/teams', authenticateToken, collaborationController.getTeams);
router.post('/teams/:teamId/invite', authenticateToken, collaborationController.inviteToTeam);

// Public shared item access (no authentication required)
router.get('/shared/:token', collaborationController.getSharedItem);

module.exports = router; 