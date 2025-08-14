const User = require('../models/User');
const crypto = require('crypto');

// Share item with another user
const shareItem = async (req, res) => {
  try {
    const { itemId, itemType, recipientEmail, message, permissions } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!itemId || !itemType || !recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if recipient exists
    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found'
      });
    }

    // Check if user owns the item
    const user = await User.findById(userId);
    const itemExists = user.uploadHistory?.some(file => file.fileName === itemId);
    
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in your uploads'
      });
    }

    // Create share record
    const shareId = crypto.randomBytes(16).toString('hex');
    const shareRecord = {
      id: shareId,
      itemId,
      itemType,
      ownerId: userId,
      recipientId: recipient._id,
      recipientEmail: recipient.email,
      message,
      permissions: permissions || 'view',
      sharedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };

    // Store share record (in a real app, you'd use a separate collection)
    if (!user.sharedItems) user.sharedItems = [];
    user.sharedItems.push(shareRecord);
    await user.save();

    // Send notification to recipient (in a real app, you'd send email)
    console.log(`Item shared with ${recipientEmail}`);

    res.json({
      success: true,
      message: 'Item shared successfully',
      data: {
        shareId,
        recipientEmail,
        permissions,
        expiresAt: shareRecord.expiresAt
      }
    });
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to share item',
      error: error.message
    });
  }
};

// Get shared items for current user
const getSharedItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get items shared by this user
    const sharedByMe = user.sharedItems || [];

    // Get items shared with this user (in a real app, you'd query a separate collection)
    const sharedWithMe = [];

    const sharedItems = [
      ...sharedByMe.map(item => ({
        ...item,
        type: 'shared_by_me',
        itemName: getItemName(item.itemId, user.uploadHistory)
      })),
      ...sharedWithMe.map(item => ({
        ...item,
        type: 'shared_with_me'
      }))
    ];

    res.json({
      success: true,
      data: sharedItems
    });
  } catch (error) {
    console.error('Get shared items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shared items',
      error: error.message
    });
  }
};

// Generate shareable link
const generateShareLink = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!itemId || !itemType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user owns the item
    const user = await User.findById(userId);
    const itemExists = user.uploadHistory?.some(file => file.fileName === itemId);
    
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in your uploads'
      });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store link (in a real app, you'd use a separate collection)
    const shareLink = {
      token,
      itemId,
      itemType,
      ownerId: userId,
      expiresAt,
      createdAt: new Date()
    };

    if (!user.shareLinks) user.shareLinks = [];
    user.shareLinks.push(shareLink);
    await user.save();

    const link = `${process.env.FRONTEND_URL}/shared/${token}`;

    res.json({
      success: true,
      message: 'Shareable link generated',
      data: {
        link,
        expiresAt,
        token
      }
    });
  } catch (error) {
    console.error('Generate link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate shareable link',
      error: error.message
    });
  }
};

// Revoke access to shared item
const revokeAccess = async (req, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove share record
    if (user.sharedItems) {
      user.sharedItems = user.sharedItems.filter(item => item.id !== shareId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Access revoked successfully'
    });
  } catch (error) {
    console.error('Revoke access error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke access',
      error: error.message
    });
  }
};

// Create team workspace
const createTeam = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const userId = req.user.userId;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Team name and description are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create team (in a real app, you'd use a separate Team model)
    const teamId = crypto.randomBytes(16).toString('hex');
    const team = {
      id: teamId,
      name,
      description,
      ownerId: userId,
      members: members || [user.email],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!user.teams) user.teams = [];
    user.teams.push(team);
    await user.save();

    res.json({
      success: true,
      message: 'Team created successfully',
      data: {
        teamId,
        name,
        description,
        memberCount: team.members.length
      }
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create team',
      error: error.message
    });
  }
};

// Get teams for current user
const getTeams = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const teams = user.teams || [];

    res.json({
      success: true,
      data: teams.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        memberCount: team.members.length,
        createdAt: team.createdAt
      }))
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get teams',
      error: error.message
    });
  }
};

// Invite user to team
const inviteToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body;
    const userId = req.user.userId;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find team
    const team = user.teams?.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is team owner
    if (team.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only team owner can invite members'
      });
    }

    // Check if user is already a member
    if (team.members.includes(email)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    // Add member to team
    team.members.push(email);
    team.updatedAt = new Date();
    await user.save();

    // Send invitation (in a real app, you'd send email)
    console.log(`Invitation sent to ${email} for team ${team.name}`);

    res.json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        teamId,
        email,
        memberCount: team.members.length
      }
    });
  } catch (error) {
    console.error('Invite to team error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation',
      error: error.message
    });
  }
};

// Get shared item by token
const getSharedItem = async (req, res) => {
  try {
    const { token } = req.params;

    // Find share link (in a real app, you'd query a separate collection)
    const user = await User.findOne({ 'shareLinks.token': token });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Share link not found or expired'
      });
    }

    const shareLink = user.shareLinks.find(link => link.token === token);
    if (!shareLink || shareLink.expiresAt < new Date()) {
      return res.status(404).json({
        success: false,
        message: 'Share link expired'
      });
    }

    // Get item details
    const item = user.uploadHistory?.find(file => file.fileName === shareLink.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Shared item not found'
      });
    }

    res.json({
      success: true,
      data: {
        item,
        sharedBy: user.username,
        expiresAt: shareLink.expiresAt
      }
    });
  } catch (error) {
    console.error('Get shared item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shared item',
      error: error.message
    });
  }
};

// Helper function to get item name
const getItemName = (itemId, uploadHistory) => {
  const item = uploadHistory?.find(file => file.fileName === itemId);
  return item ? item.originalName : 'Unknown Item';
};

module.exports = {
  shareItem,
  getSharedItems,
  generateShareLink,
  revokeAccess,
  createTeam,
  getTeams,
  inviteToTeam,
  getSharedItem
}; 